var express = require('express');
var router = express.Router();

var dbconn = require('./db');

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
  console.log('req.user:', req.user);
  req.db.locations.save(req.body).then(function(resp){
    console.log('saved location:', resp);
    res.status(200).send(resp);
  }).catch(function(err){
    console.log('failed save', err);
    return next(err);
  });
});

module.exports = router;
