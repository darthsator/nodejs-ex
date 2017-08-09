// module.exports.testproducts = function(sdb, callback) {
module.exports.testproducts = function(sdb, callback) {
  return new Promise(function(resolve, reject){


    var result = false;
    sdb.collection("products").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Table products dropped");
    });
    // sdb.collection('counts').drop(function(err, delOK) {
    //   if (err) throw err;
    //   if (delOK) console.log("Table deleted");
    // });
    var products = [
      {tag: 1  ,name: 'Kleid'  ,size: 'S',  color: 'grey' },
      {tag: 2  ,name: 'Schuhe' ,size: 'M',  color: 'vantablack' },
      {tag: 3  ,name: 'Rock'   ,size: 'L',  color: 'violet' },
      {tag: 4  ,name: 'Bluse'  ,size: 'XL', color: 'blue' },
      {tag: 5  ,name: 'Tanga'  ,size: 'XS', color: 'pattern' },
      {tag: 6  ,name: 'Jeans'  ,size: 'M',  color: 'yellow' },
      {tag: 7  ,name: 'Top'    ,size: 'L',  color: 'green' },
      {tag: 8  ,name: 'Shirt'  ,size: 'S',  color: 'brown' },
      {tag: 9  ,name: 'Short'  ,size: 'M',  color: 'orange' },
      {tag: 10 ,name: 'Hoodie' ,size: 'XS',  color: 'red' }
    ];
    sdb.collection("products").insertMany(products, function(err, res) {
      if (err) console.log(err);
      console.log('insert done');
      sdb.collection('products').count(function(err, count ) {
        if (err) console.log(err);
        if(count == products.length) {
          console.log('products inserted: '+count);
          result=true;
        } else {
          console.log('count failed');
        }
        console.log(result);
        // callback(result);
        resolve();
      });
    });
  })
}

// module.exports.statsMethods = function(sdb, callback) {
module.exports.statsMethods = function(sdb, callback) {
  return new Promise(function(resolve, reject){
    var result = false;
    var col = sdb.collection("supportedMethods");
    col.drop(function(err, delOK) {
      if (err) console.log(err);
      if (delOK) console.log("Table supportedMethods dropped");
    });
    var methods = [{method:"sessionCount"},
                   {method:"sessionsByHour"}
                 ];
    col.insertMany(methods, function(err, res){
      if (err) console.log(err);
      console.log('insert done');
      // callback(result);
      resolve();
    });
  });
}
