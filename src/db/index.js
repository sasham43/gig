var _config = require('../config');
var assert = require('assert'); // get this
var q = require('q');

var config = config.get();
var connections;

module.exports = function(name){
  connections = connections || {};
  var d = q.defer();

  if(connections[name]){
    d.resolve(connections[name])
  } else {
    require('massive').connect({
      connectionString: config[name].connection,
      scripts: require('path').join(__dirname, '../db')
    }, function(err, db){
      if(err){
        console.log('db connect error:', err)
        d.reject(err);
      } else {
        console.log('connecting to db')
        connections[name] = db;
        d.resolve(db);
      }
    })
  }

  return d.promise;
}
