var server   = require('../server.js'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();


chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server;

// console.log('server:');
// console.log(reqServer);
// console.log(process.env.HTTP_TEST_SERVER == reqServer);
// console.log(process.env.HTTP_TEST_SERVER);

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

    it('inserting products should return 200', function(done){
      chai.request(reqServer)
      .get('/setupTests')
      .end(function(err, res) {
        if(err) console.log(err);
        if(res.status != 200) console.log(res);
          res.should.have.status(200);
          done();
      })
    })
})
