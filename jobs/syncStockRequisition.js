
function SyncStockRequistion() {

       
       var stockRequisitionArray = [];

       
       db.all("SELECT * FROM stockRequisitionSummary Where isSync = 0", function(err, rows){

                 if(err){
               	  	 console.log(err);
               	  	 db.exec('ROLLBACK');
               	  	 return false;
               	  }
               	  else{
                   stockRequisitionArray = rows;
               	  }


                  stockRequisitionArray.forEach( async function (obj){ 
                      let json = JSON.parse(obj['json']);
                      json['stockReference'] = obj['stockReference'];
                      json['requisitionTimeLocal'] = obj['requisitionTimeLocal'];
                      json['timezone'] = obj['timezone'];
                      let response = await api.postByChain('stockRequisition', json);

                      let stockRequisitionID = obj['ID'];


                    if(response['data']['status'] == true){
                      let requisitionID = response['data']['requisitionID'];
                       db.exec('BEGIN');
                        db.run(`UPDATE stockRequisitionSummary SET isSync = 1, requisitionID = ${requisitionID} Where ID = ${stockRequisitionID}`, function(err){
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

module.exports.SyncStockRequistion = SyncStockRequistion;