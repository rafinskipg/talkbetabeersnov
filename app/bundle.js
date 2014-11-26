(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var loader = new PxLoader();
var images = {};

function onLoadComplete(fn){
	loader.addCompletionListener(fn);
}

function addImage(uri, alias){
	images[alias] = loader.addImage(uri);
}

function getImage(alias){
	return images[alias];
}

module.exports = {
	addImage: addImage,
	getImage: getImage,
	onLoadComplete: onLoadComplete,
	start: loader.start
}
},{}],2:[function(require,module,exports){
/** YEAH **/
'use strict';

var assetsLoader = require('./assetsLoader');
var clock = require('./components/clock');
var settings = require('./settings');
var playerBoxes = require('./components/players');
var utils = require('./utils');


var song, then, now, canvas,ctx, shown,  color, time, limit = 30, paused = false, maxTries = 30, tries = 0;


function start(playersInfo){
  playerBoxes.init(playersInfo);
  $('#canvas').on('touchstart click', function(){
    startPause();
  });
  time = 0.0;
  launchCanvas();
}

function launchCanvas(){
  $('#canvas').removeClass('hidden');

  then = Date.now();
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth //Or wathever
  canvas.height = window.innerHeight; //Or wathever
  ctx = canvas.getContext('2d');
  
  loop();
}

var loop = function loop(){
  now = Date.now();
  var dt = now - then;
  then = now;

  if(!paused){
    clear();
    update(dt);
    render();
  }

  requestAnimationFrame(loop);
}

function update(dt){
  var newDt = dt/1000;
  updateClock(newDt);
}


function startPause(){
  if(!paused){
    tries++;
  }

  paused = !paused;

  if(tries >= 3){
    endGame();
  }
}

function endGame(){
  canvas.width = canvas.width;
  var text = 'GAME OVER';

  ctx.font = 'bold ' + canvas.width / 10 + 'px sans-serif';
  var dim = ctx.measureText(text);
  var y = (canvas.height - 30) / 2;
  var x = (canvas.width - dim.width) / 2;

  ctx.fillText(text, x, y); 

  var text2 = 'goals';

  ctx.font = 'bold ' + canvas.width / 20 + 'px sans-serif';
  var dim2 = ctx.measureText(text2);
  var y2 = ((canvas.height - 30 ) / 2  ) +  40;
  var x2 = (canvas.width - dim2.width) / 2;

  ctx.fillText(text2, x2, y2);
}

function updateClock(dt){
  time += dt;
  if(time > limit){
    endGame();
  }
}

function clear(){
 // ctx.globalCompositeOperation = "source-over";
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
  var gradient = ctx.createLinearGradient(canvas.width, canvas.height,0, 0);
 
  gradient.addColorStop(0, "rgb(84, 141, 189)");
  gradient.addColorStop(1, "rgb(99, 64, 113)");
  ctx.fillStyle = gradient;
    
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";

}

function render(){
  clock.render(ctx, time, canvas);
  playerBoxes.render(ctx, canvas);
}


module.exports = {
  start: start
}
},{"./assetsLoader":1,"./components/clock":3,"./components/players":4,"./settings":7,"./utils":8}],3:[function(require,module,exports){
'use strict';

function render(ctx, time, canvas){
  var miliseconds = parseInt(time * 1000, 10);
  
  var seconds = Math.round(miliseconds/ 1000);
  seconds =(seconds+'').length < 2  ? '0'+seconds : seconds;
  var centesimas = (miliseconds+'').substr(2,4);
  centesimas = centesimas.length < 2  ? '0'+centesimas : centesimas;
  var minutes = Math.floor(seconds / 60);
  minutes =(minutes+'').length < 2  ? '0'+minutes : minutes;

  var text = minutes + ':'+ seconds +':'+centesimas;

  ctx.font = 'bold ' + canvas.width / 10 + 'px sans-serif';
  var dim = ctx.measureText(text);
  var y = (canvas.height - 30) / 2;
  var x = (canvas.width - dim.width) / 2;

  ctx.fillText(text, x, y);   
}


module.exports = {
  render: render
}
},{}],4:[function(require,module,exports){
'use strict';

var players;

function init(playersInfo){
  players = playersInfo;
}

function update(turn){

}

function render(ctx, canvas) {
  var x = 30  ;

  players.forEach(function(player){
    ctx.font = 'bold 20px sans-serif';
    var dim = ctx.measureText(player.name);
    ctx.beginPath();
    ctx.rect(x, canvas.height - 125, dim.width + 40, 50);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillColor = 'white';
    ctx.fillText(player.name, x + 20, canvas.height -100);  
    x += dim.width + 60;
  });
}

module.exports = {
  render: render,
  update: update,
  init : init
}
},{}],5:[function(require,module,exports){
'use strict';
var canvas = require('./canvas');
var utils = require('./utils');
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
},{"./canvas":2,"./utils":8}],6:[function(require,module,exports){
/*
  Start endpoint
 */

var gameConnection = require('./gameConnection');

$(document).ready(function(){
  gameConnection.init();
});
  
},{"./gameConnection":5}],7:[function(require,module,exports){
window.SETTINGS = {
  birdSpeed:{
    name: 'Bird speed',
    value: 80
  },
  birdSightRadius:{
    name: 'Bird sight radius',
    value: 100
  },
  birdAttractionRadius: {
    name: 'Bird attraction radius - Green',
    value: 130
  },
  birdAlignmentRadius: {
    name: 'Bird alignment radius - Blue',
    value: 24
  },
  birdRepulsionRadius: {
    name: 'Bird repulsion radius - Red',
    value: 11
  },
  birdSightRadius: {
    name: 'Bird sight radius',
    value: 300
  },
  debugging:{
    name:'Debugging level',
    value: 0,
    max: 5
  }
}
},{}],8:[function(require,module,exports){
function random(a, b){
  return Math.floor(Math.random() * b) + a;
}

function randomColor(){
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomRGBColor(){
  var color = {};
  color.r = Math.round(Math.random()*255);
  color.g = Math.round(Math.random()*255);
  color.b = Math.round(Math.random()*255);
  return color;
}

function flipCoin() {
    return (Math.floor(Math.random() * 2) == 0);
}

module.exports = {
  random: random,
  randomColor: randomColor,
  randomRGBColor: randomRGBColor,
  flipCoin: flipCoin
}
},{}]},{},[6]);
