var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis'),
    redisClient = redis.createClient();

var rest = require('restler');

rest.get('http://tds.shovik.com/toilets.json').on('complete', function(result) {
  if (result instanceof Error) {
    console.log('Error loading toilets:', result.message);
  } else {
    for(var i = 0; i < result.length; i++) {
      var toiletId = result[i].id.toString();
      redisClient.subscribe('toilet/' + toiletId);
    }

    console.log('Connected toilets: ' + result.length.toString());
  }
});

redisClient.on('message', function(channel, message) {
  io.emit(channel, message);
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});
