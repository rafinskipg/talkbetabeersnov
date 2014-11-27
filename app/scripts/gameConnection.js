'use strict';
var canvas = require('./canvas');
var utils = require('./utils');
var enemiesController = require('./enemiesController');
var socket, gameIdentificator, playerInfo;


function init(){
  playerInfo = { name : generateRandomName(), id: generateRandomId() };

  socket = io('http://127.0.0.1:3000');

  //Render user list
  socket.on('refresh_user_list', function(users){
    var content = $('<div ></div>');
    users.forEach(function(user){
      content.append('<div class="list-group-item">'+ user.name + '</div>');
    })
    $('.users').html(content);
  });

  //Request play vs AI
  $('.vsAI').on('click', function(){
    $('.waiting').removeClass('hidden');
    socket.emit('request_play_AI', playerInfo);
  });


  //Request play on click
  $('.start').on('click', function(){
    $('.waiting').removeClass('hidden');
    socket.emit('request_play', playerInfo);
  });

  //Start game
  socket.on('start_game', function(game){
    gameIdentificator = game.id;
    $('.waiting').addClass('hidden');
    $('.websocketsInfo').addClass('hidden');
    canvas.start(game.players);
  });


  //Emit connected
  socket.emit('user_connected', playerInfo);

  //Push enemy
  socket.on('new_enemy', function(enemy){
    console.log('new enemy connected');
    enemiesController.addEnemy(enemy);
  });

}


var surnames = [
  'der Strauttenn',
  'Noobancio',
  'de la rue',
  'Pedrolo',
  'Villuencia',
  'Durandes',
  'Montiuses',
  'Salamander',
  'Topacio',
  'Jar Jam',
  'Commitment',
  'Freeman',
  'Asimov'
];

var names = [
  'Heston',
  'Santiagous',
  'Oscarweb',
  'Kulunguelele',
  'Sinsorus',
  'Moeba',
  'Ardilla',
  'Alicate',
  'Lambda',
  'Morgan',
  'Isaac'
];

var titles = [
  'Dr.',
  'Dra.',
  'Miss',
  'Mr',
  'Señor',
  '',
  'Don',
  'Doña'
]

function generateRandomName(){
  var indexTitle = utils.random(0, titles.length -1);
  var indexName = utils.random(0, names.length -1);
  var indexSurName = utils.random(0, surnames.length -1);

  return titles[indexTitle] + ' ' + names[indexName] + ' ' + surnames[indexSurName];
}

function generateRandomId(){
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
}



module.exports = {
  init: init
}