module.exports.testproducts = function(sdb) {
  var result = false;
    console.log(typeof(server));
    console.log(typeof(sdb));
  sdb.collection("products").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Table deleted");
  });
  var products = [
    {tag: 1, size: 'S', color: 'blue' },
    {tag: 2, size: 'M', color: 'red' },
    {tag: 3, size: 'L', color: 'green' }
  ]
  sdb.collection("products").insertMany(products, function(err, res) {
    if (err) throw err;
    db.collection('products').count(function(err, count ){
      if(count == products.count){
        result=true;
      }
    });

  });
  return result;
}
