var express = require('express');
var router = express.Router();
var config = require('./config');

var dbconn = require('./db');

var mapbox_token = config.get('mapbox_token');
var mapbox = require('mapbox');
var client = new mapbox(mapbox_token)

router.use(function(req, res, next){
  dbconn('gig-db').then(function(db){
    req.db = db;
    next();
  });
});

router.get('/', function(req, res, next){
  res.status(200).send(client)
})



module.exports = router;
