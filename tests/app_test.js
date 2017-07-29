var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to / should return 200', function(done){
        chai.request(reqServer)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    it('GET to /pagecount should return 200', function(done){
        chai.request(reqServer)
        .get('/pagecount')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    it('GET to /detego should return 200', function(done){
        chai.request(reqServer)
        .get('/detego')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

    it('inserting products should drop and insert', function(done){
      if(server.db) {
        var sdb = server.db;
        sdb.collection("products").drop(function(err, delOK) {
          // if (err) throw err;
          if (delOK) console.log("Table deleted");
          // db.close();
        });
        products = [
          {pid: 1, size: 'S', color: 'blue' },
          {pid: 2, size: 'M', color: 'red' },
          {pid: 3, size: 'L', color: 'green' }
        ]
        sdb.collection("products").insertMany(products, function(err, res) {
          if (err) throw err;
          // db.close();
        });
      } else {
        console.log('no server db?!');
        server.testing();
      }

      done();
    })
})
