var express = require('express');
var router = express.Router();
var config = require('./config');

var dbconn = require('./db');

var mapbox_token = config.get('mapbox_token');
var mapbox = require('mapbox');
var client = new mapbox(mapbox_token)

// router.use(function(req, res, next){
//   dbconn('gig-db', 'map').then(function(db){
//     req.db = db;
//     next();
//   });
// });

router.post('/geocode', function(req, res, next){
  console.log('geocode:', req.body)
  client.geocodeForward(req.body)
  .then(function(response) {
    // res is the http response, including: status, headers and entity properties
    var data = response.entity; // data is the geocoding result as parsed JSON
    res.status(200).send(data);
  })
  .catch(function(err) {
    // handle errors
    return next(err);
  });
});

router.get('/', function(req, res, next){
  res.status(200).send(client)
});



module.exports = router;
