var _config = require('../config');
var assert = require('assert'); // get this
var q = require('q');
var massive = require('massive');

var config = _config.get();
var connections;

module.exports = function(name){
  connections = connections || {};
  var d = q.defer();

  if(connections[name]){
    d.resolve(connections[name])
  } else {
    console.log('connecting to db')

    massive({
      connectionString: config[name].connection,
      scripts: require('path').join(__dirname, '../db')
    }).then(function(db){
        // console.log('connected to db:',db)
        connections[name] = db;
        d.resolve(db);
    }).catch(function(err){
      console.log('err connecting to db:', err)
      d.reject(err);
    })
  }

  return d.promise;
}
