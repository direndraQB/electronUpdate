//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('ssDB');
var isOpen =false;
var isButtonClicked = false;
var  currDate;

var fetchingErrMsg='Error in Fetching order!'
var reRenderLocation='inventoryDashboard.html'
var returnedStockProductsData=[]
var vendorDetail;
var orderID;

$(async()=>{
    await getMenu('View Stock Returned')
    await backNavigation()
 
    // currDate = currDate.split("-")
    // currDate = currDate[1]+'/'+currDate[2]+'/'+currDate[0]
    getReturnedStockList('all')
    currDate = new Date().toDateInputValue()
})
backNavigation=()=>{
    $('#imgForward').css('opacity',0.5)
    $('#imgBack').css({'opacity':1 , 'cursor' : 'pointer'}).click(()=>{
        window.location.href=reRenderLocation
    })
}


Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function getReturnedStockList(type){
    var fromValue = $('#fromDate').val();
    var toValue = $('#toDate').val();
    // fromValue = fromValue.split("/").reverse().join("-");
    // toValue = toValue.split("/").reverse().join("-");

    if((fromValue == "" ||toValue == "")  && type!="all" ){
        var message = 'Please fill date field!'
        isError(message)
    }
    else if(fromValue>toValue){
        $('#fromDate').val(currDate);
        $('#toDate').val(currDate);
        var message ='Select valid interval!'
        isError(message)
    }
    else{
        if(type=="all"){
            db.all(`SELECT * FROM stockTransactionSummary WHERE fulfillmentStatus NOT LIKE 'FULFILLED' AND billNumber != ''`,(err,returnedStockData)=>{
                if(err){
                    console.log(err)
                    isError(fetchingErrMsg,reRenderLocation)
                }
                else{             
                    console.log(returnedStockData)
                    parsedData = returnedStockData.map(m=>{
                        var jsonData = JSON.parse(m.json)
                        jsonData.tID = m.transactionID
                        
                        return jsonData;
                    })
                    console.log(parsedData,'parsedData')
                    parsedData.map(m=>{
                        var timeData = m.transactionTimeLocal.split(" ")
                        m['orderDate']=timeData[0]
                        m['orderTime']=timeData[1]
                        return m
                    })
                    $('#returnedStockTable').bootstrapTable('destroy')
                    $('#returnedStockTable').bootstrapTable({
                        data:parsedData,
                        search:true,
                        reinit: true,
                        trimOnSearch:false,
                        pagination:true
                    });
                    $('.customInputSearch').css({"margin":"0","border-radius": "4px 0 0 4px"}).after('<button id="searchDiv" class="flex-row"><img src="../../assets/img/search_icon_white.png"</button>');
                    $('.customInputSearchDiv').addClass('flex-row margin-20')
                }
            })
        }
        else{
            db.all(`SELECT * FROM stockTransactionSummary WHERE fulfillmentStatus NOT LIKE 'FULFILLED' AND billNumber != '' AND  DATE(transactionTimeLocal) BETWEEN '${fromValue}' AND '${toValue}'`,(err,returnedStockData)=>{
                if(err){
                    console.log(err)
                    isError(fetchingErrMsg,reRenderLocation)
                }
                else{                     
                    console.log(returnedStockData)
                    parsedData = returnedStockData.map(m=>{
                        return JSON.parse(m.json);
                    })
                    console.log(parsedData,'parsedData')
                    parsedData.map(m=>{
                        var timeData = m.transactionTimeLocal.split(" ")
                        m['orderDate']=timeData[0]
                        m['orderTime']=timeData[1]
                        return m
                    })
                    $('#returnedStockTable').bootstrapTable('destroy')
                    $('#returnedStockTable').bootstrapTable({
                        data:parsedData,
                        search:true,
                        reinit: true,
                        trimOnSearch:false,
                        pagination:true
                    });
                    $('.customInputSearch').css({"margin":"0","border-radius": "4px 0 0 4px"}).after('<button id="searchDiv" class="flex-row"><img src="../../assets/img/search_icon_white.png"</button>');
                    $('.customInputSearchDiv').addClass('flex-row margin-20')
                }
            })
        }
    }
}


renderPopover=(value,row)=>{
    console.log(row,'rowrow')
    return `<div style="position:relative" id='${row.tID}' onclick="showPopover('${row.tID}','${row.purchaseOrderID}',this)" class ="customViewButton"> <img src="../../assets/img/ic-more-vertical-gray.png" /> </div>`
}

$('body').click(()=>{
    if(isOpen && isButtonClicked == false){
        $(".popoverDiv").remove();
        isOpen=false;
    }else if(isOpen && isButtonClicked == true){
        isButtonClicked = false;
    }
})

function showPopover(tID,poID,el){
    const rect = el.getBoundingClientRect();
    orderID = poID

    var positionObj =  {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };

    isOpen= true;
    isButtonClicked = true;
    $(".popoverDiv").remove();

    if(positionObj.top > 800){
        $("#"+tID).append(`<div class='popoverDiv popoverPosition'>
        <span class="popoverSpan"  onclick="getReturnedStockProducts('${tID}','')"><img class="popoverIcon" src="../../assets/img/download_grey.png" /> <small>Download</small></span>
        <span class="popoverSpan"  onclick="getReturnedStockProducts('${tID}','print')"><img class="popoverIcon" src="../../assets/img/print_grey.png" /> <small>Print</small></span>
        <a class="popoverSpan" href="returnedStockDetails.html?tID=${tID}=${poID}"><img class="popoverIcon" src="../../assets/img/view_icon.png" /> <small>View</small></a></div>`);
    }
    else {
        
        $("#"+tID).append(`<div class="popoverDiv">
        <span class="popoverSpan"  onclick="getReturnedStockProducts('${tID}','')"><img class="popoverIcon" src="../../assets/img/download_grey.png" /> <small>Download</small></span>
        <span class="popoverSpan"  onclick="getReturnedStockProducts('${tID}','print')"><img class="popoverIcon" src="../../assets/img/print_grey.png" /> <small>Print</small></span>
        <a class="popoverSpan" href="returnedStockDetails.html?tID=${tID}=${poID}"><img class="popoverIcon" src="../../assets/img/view_icon.png" /> <small>View</small></a></div>`);
    }	  
}


getReturnedStockProducts=async(tID,action)=>{
    tID= tID
    vendorDetail = await new Promise((resolve,reject)=>{
    
        db.get('SELECT *  FROM vendors',function(err, data) {
    
            if(err){
                console.log(err)
                isError(fetchingErrMsg,reRenderLocation)
            }
            else{
                resolve(data);
            }
        })
    })
      
    var stockData = await new Promise((resolve,reject)=>{
        db.get(`SELECT * FROM stockTransactionSummary WHERE transactionID = '${tID}'`,function(err, stockData) {
    
            if(err){
                console.log(err)
                isError(fetchingErrMsg,reRenderLocation)
            }
            else{
                resolve(stockData);
            }
        })
    })

    var returnedStockData = stockData.json;
    parsedReturnedStockData = JSON.parse(returnedStockData);
    console.log(parsedReturnedStockData,'parsedReturnedStockData')
    returnedStockProductsData = parsedReturnedStockData.transactionProducts
    returnedStockProductsData = returnedStockProductsData.filter(m=>m.voidAmount > 0)
    returnedStockProductsData.map((m,i)=>{
        m['SNo']= i+1;

        return m
    })


    console.log(returnedStockData,'returnedStockData')
    triggerPrintPdf(returnedStockProductsData,action)
 }

 triggerPrintPdf = (returnedStockProductsData,action) => {
    var currentTimestamp = moment().format("YYYYMMDDHHmmss")
    var table1columns = [
        {title: "#", dataKey: "SNo"},
        {title: "Item Name", dataKey: "productName"}, 
        {title: "Price", dataKey: "productActualPrice"},
        {title: "Returned Quantity", dataKey: "voidQuantity"},
        {title: "Returned Price", dataKey: "voidAmount"},
        {title: "Total Price", dataKey: "inventoryCost"},
        // {title: "Total", dataKey: "totalPrice"}, 
    ];
        
    var columnsObj ={
        table1columns,
    }

    var tableData = returnedStockProductsData;
    var orderInfoDetail = parsedReturnedStockData


    var billInfo={
        'orderNo':orderInfoDetail.stockReference,
        'billNo':orderInfoDetail.billNumber,
        'billTime':orderInfoDetail.transactionTimeLocal,
    }

    var orderInfo={
        'totalPrice' : orderInfoDetail.returnedPrice,
        'totalItems' : tableData.length,
    }

    var docInfo = {
        'action':action,
        'title' : 'Stock Summary',
        'storeInfoShown' :true,
        'billInfo':billInfo,
        'vendorInfo' :vendorDetail,
        'orderInfo' : orderInfo,
        'taxShown': false,
        'fileName' : `${orderID}_${currentTimestamp}.pdf`
    }

    console.log(tableData)
    printPdf(columnsObj,tableData,docInfo) 

    // if(type){
    //     $('#successTag').text('Print')
    //     $('#successTagl').text('printed')
    //     $('.fileName').text(`returnedStock.pdf`)
    //     $('#successModal').modal('show');
    //     $('#fileLocation').css('display','none')
    // }
    // else if(status){
    //     $('#successTag').text('Download')
    //     $('#successTagl').text('downloaded')
    //     $('.fileName').text(`returnedStock.pdf`)
    //     $('#successModal').modal('show');
    // }
};

closeModal=()=>{
    $(`#successModal`).modal('hide');
}