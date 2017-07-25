var express = require('express');
var bodyParser = require('body-parser');

var root = require('./root');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

var listenPort = process.env.PORT || 3001;

app.use('/', root);

app.use(function(err, req, res, next){
  console.log('error:', err);
  res.status(err.statusCode || 500).json(err);
});

app.listen(listenPort, function(){
  console.log('server listening on port', listenPort + '...');
});