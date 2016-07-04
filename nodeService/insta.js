var express     = require('express');
var bodyParser = require( 'body-parser' );
var app = express();

var colors  = require('colors');
var server  = require('http').createServer(app).listen(process.env.PORT || 5000);

var InstagramStream = require('instagram-realtime');
//var secrets = require('./secrets.json');

var stream = InstagramStream(
  server,
  {
    client_id     : "18cc9e3a18fe473f8216bf49824397ca",
    client_secret : "2f129ebd961b4e1c944134671a07ec05",
    url           : "http://localhost:8100",
    callback_path : 'http://localhost:8100'
  }
);

stream.on('unsubscribe', function (req, resp) {
  console.log('unsubscribe'.green);
  stream.subscribe({ tag : 'yolo' });
});

stream.on('new', function (req, body) {
  console.log(body);
});

app.get('/', function (req, resp) {
  resp.set('Content-Type', 'text/plain; charset=utf-8');
  resp.end('🍕🏊');
});

stream.unsubscribe('all');