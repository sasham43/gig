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

router.get('/geocode/:address', function(req, res, next){
  console.log('geocode:', req.params.address)
  client.geocodeForward(req.params.address, {})
  .then(function(response) {
    console.log('good')
    // res is the http response, including: status, headers and entity properties
    var data = response.entity; // data is the geocoding result as parsed JSON
    res.status(200).send(response);
  })
  .catch(function(err) {
    // handle errors
    console.log('bad')
    return next(err);
  });
});

router.get('/', function(req, res, next){
  res.status(200).send(client)
});



module.exports = router;
