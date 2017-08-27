var express = require('express');
var router = express.Router();

var dbconn = require('./db');
var config = require('./config');

var mapbox_token = config.get('mapbox_token');
var mapbox = require('mapbox');
var client = new mapbox(mapbox_token)

// router.use(function(req, res, next){
//   dbconn('gig-db', 'loc').then(function(db){
//     req.db = db;
//     next();
//   });
// });

router.get('/', function(req, res, next){
  req.db.locations.find().then(function(resp){
    res.status(200).send(resp);
  }).catch(function(err){
    console.log('failed get', err);
    return next(err);
  });
});

router.post('/add', function(req, res, next){
  var location = req.body;
  location.owner_id = req.user.id;
  // console.log('req.user:', req.user);

  // find lat/lng if necessary
  var address = location.street + ', ' + location.city + ', ' + location.state + ', ' + location.zip;
  client.geocodeForward(address, {})
  .then(function(response) {
    // res is the http response, including: status, headers and entity properties
    var data = response.entity; // data is the geocoding result as parsed JSON
    // res.status(200).send(response);

    if(data.features && data.features.length){
      location.lat = data.features[0].center[0];
      location.lng = data.features[0].center[1];
    }
    req.db.locations.save(location).then(function(resp){
      console.log('saved location:', resp);
      res.status(200).send(resp);
    }).catch(function(err){
      console.log('failed save', err);
      return next(err);
    });
  })
  .catch(function(err) {
    // handle errors
    return next(err);
  });
});

module.exports = router;
