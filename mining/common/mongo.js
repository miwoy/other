var config = require('../config');
var mongoose = require('mongoose');
var path = "mongodb://" + config.mongodb.username + ":" + config.mongodb.pwd + "@" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.db;

mongoose.connect(path, function(err) {
    if (err) return console.log(err);

});    


module.exports = mongoose;