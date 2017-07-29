var server   = require('../server');

function doSetup {
  if(server.db) {
    var db = server.db;
    db.collection("products").drop(function(err, delOK) {
      // if (err) throw err;
      if (delOK) console.log("Table deleted");
      // db.close();
    });
    products = [
      {pid: 1, size: 'S', color: 'blue' },
      {pid: 2, size: 'M', color: 'red' },
      {pid: 3, size: 'L', color: 'green' }
    ]
    db.collection("products").insertMany(myobj, function(err, res) {
      if (err) throw err;
      // db.close();
  });
  }
}
module.exports = TestSetup;
