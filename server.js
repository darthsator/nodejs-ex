//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan'),
    tsetup  = require('./tsetup.js');


Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
// app.use(express.static(__dirname + '/detego'));
app.set('json spaces', 2);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
 db = null;
var dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s to DB: %s', mongoURL, dbDetails.databaseName);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('visitors');
    // Create a document with request IP and current time of request

    col.insert({ip: req.headers['x-forwarded-for'], date: Date.now(), ua:req.headers['user-agent']});
    col.count(function(err, count){
      if (err) console.log(err);
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('visitors').count(function(err, count ){
      res.send('{ visitors: ' + count + '}');
    });
  } else {
    res.send('{ visitors: -1 }');
  }
});

app.get('/detego', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('visitors').insert({ip: req.headers['x-forwarded-for'], date: Date.now(), ua:req.headers['user-agent'], page: '/detego'});
    res.render('detego_client.html', { stext : 'testing stuff'});
  } else {
    res.send('{ error: -1 }');
  }
});

app.get('/getAllVisitors', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('visitors').find({}).toArray(function(err, result) {
       if (err) throw err;
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.json(result);
     })
  } else {
    res.send('{ no db con here }')
  }
});

app.get('/getAllProducts', function (req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('products').find({}).toArray(function(err, result) {
       if (err) console.log(err);
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.json(result);
     })
  } else {
    res.send('{ no db con here }')
  }
});

app.get('/setupTests', function (req, res) {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    if(tsetup.testproducts(db)){
      res.sendStatus(200).send('setup ok');
    } else {
      res.send('insertion failed');
    }
  } else {
    res.send('{ no db con here }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports.database = db;
module.exports = app ;
