function syncStockTransaction() {

       
       var stockTransactionArray = [];

       
       db.all("SELECT * FROM stockTransactionSummary Where isSync = 0", function(err, rows){

                 if(err){
               	  	 console.log(err);
               	  	 db.exec('ROLLBACK');
               	  	 return false;
               	  }
               	  else{
                   stockTransactionArray = rows;
               	  }
            

                  stockTransactionArray.forEach( async function (obj){ 
                      let json = JSON.parse(obj['json']);
                      
                      let response = await api.postByChain('stockTransaction', json);

                      let stockTransactionID = obj['ID'];


                    if(response['data']['status'] == true){
                      let transactionID = response['data']['transactionID'];
                        db.exec('BEGIN');
                        db.run(`UPDATE stockTransactionSummary SET isSync = 1, transactionID = ${transactionID}  Where ID = ${stockTransactionID}`, function(err){
                        if(err){
                           db.exec('ROLLBACK');
                           console.log(err);
                        }
                        else{
                          db.exec('COMMIT');
                        }
                         
                    });
                     }

                  }, 
                  function(err) {
                    if(err)
                    {
                      console.log(err);
                      db.exec('ROLLBACK');
                    }
                    else{
                          db.exec('COMMIT');
                        }

                  }); 

       });

}

module.exports.syncStockTransaction = syncStockTransaction;