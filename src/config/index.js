var fs = require('fs');
var path = require('path');
var nconf = require('nconf');

var configFileName = path.join(__dirname, (process.env.NODE_ENV ? process.env.NODE_ENV : 'default') + '.json');

nconf.arv()
  .env()
  .file({
    file: configFileName
  })
  .defaults({});

module.exports = nconf;
