module.exports.testproducts = function(sdb)
{
    console.log(typeof(server));
    console.log(typeof(sdb));
  sdb.collection("products").drop(function(err, delOK) {
    // if (err) throw err;
    if (delOK) console.log("Table deleted");
    // db.close();
  });
  var products = [
    {pid: 1, size: 'S', color: 'blue' },
    {pid: 2, size: 'M', color: 'red' },
    {pid: 3, size: 'L', color: 'green' }
  ]
  sdb.collection("products").insertMany(products, function(err, res) {
    if (err) throw err;

  });
}
