var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var bodyParser = require('body-parser');
var machineNameGenerator = require('./machineNameGenerator');
var twitter = require('./twitter');

app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() );

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:9000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

var players = [], matched_players = [], activeGames = [], vsAigames = [];

io.on('connection', function(socket){
  var connectedPlayer;

  console.log('a user connected');

  socket.on('user_connected', function(player){
    players.push(player);
    connectedPlayer = player;
    io.emit('refresh_user_list', players);
  });


  socket.on('request_play_AI', function(player){
    createVSAIGame(player);
    twitter.linkToTwitter(function(tweet){
      console.log('new enemy incoming...!');
      socket.emit('new_enemy', tweet);
    })
  });

  socket.on('disconnect', function(){
    players =  _.compact(players.map(function(player){
      if(player.id != connectedPlayer.id){
        return player;
      }
    }));
  
    io.emit('refresh_user_list', players);
  });

});


function createVSAIGame(player){
  var gameId = 'vsAi' + Date.now() + Math.random(1000);
  var machine = generateRandomMachine('easy');
  var game = {
    id: gameId, 
    players: [player, machine],
    type: 'ai'
  };

  vsAigames.push(game);
  io.emit('start_game', game);
}


function generateRandomMachine(difficulty){
  //Check difficulties
  var machineId = 'ai' + Date.now() + Math.random(1000);
  return {
    id: machineId,
    name: machineNameGenerator.generate()
  }
}

http.listen(3000);

module.exports = http;