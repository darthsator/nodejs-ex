module.exports.testproducts = function(sdb) {
  var result = false;
  sdb.collection("products").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Table deleted");
  });
  // sdb.collection('counts').drop(function(err, delOK) {
  //   if (err) throw err;
  //   if (delOK) console.log("Table deleted");
  // });
  var products = [
    {tag: 1, size: 'S', color: 'grey' },
    {tag: 2, size: 'M', color: 'vantablack' },
    {tag: 3, size: 'L', color: 'violet' },
    {tag: 4, size: 'XL', color: 'blue' },
    {tag: 5, size: 'XS', color: 'pattern' }
  ]
  sdb.collection("products").insertMany(products, function(err, res) {
    if (err) console.log(err);
    sdb.collection('products').count(function(err, count ){
      if(count == products.count){
        console.log('products inserted: '+count)
        result=true;
      }
    });
  });
  return result;
}
