/** YEAH **/
'use strict';

var assetsLoader = require('./assetsLoader');
var clock = require('./components/clock');
var settings = require('./settings');
var player = require('./player');
var enemiesController = require('./enemiesController');
var playerBoxes = require('./components/players');
var utils = require('./utils');


var song, then, now, canvas,ctx, canvas2, ctx2, shown,  color, time, limit = 50, paused = false, maxTries = 30, tries = 0;


function start(playersInfo){
  player.initialize(playersInfo[0]);
  playerBoxes.init([player.getEntity()]);
  $('#canvas').on('touchstart click', function(){
    startPause();
  });
  time = 0.0;
  launchCanvas();
}

function launchCanvas(){
  $('canvas').removeClass('hidden');

  then = Date.now();
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth //Or wathever
  canvas.height = window.innerHeight; //Or wathever
  ctx = canvas.getContext('2d');
  canvas2 = document.getElementById('canvas2');
  canvas2.width = window.innerWidth //Or wathever
  canvas2.height = window.innerHeight; //Or wathever
  ctx2 = canvas2.getContext('2d');
  
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
  enemiesController.update(newDt, [player.getEntity()]);
  player.update(newDt);
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
  paused = true;
}

function updateClock(dt){
  time += dt;
  if(time > limit){
    endGame();
  }
}


function clear(){

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx2.canvas.width = window.innerWidth;
  ctx2.canvas.height = window.innerHeight;
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  
  
  var gradient = ctx.createLinearGradient(canvas.width, canvas.height,0, 0);
 
  gradient.addColorStop(0, "rgb(84, 141, 189)");
  gradient.addColorStop(1, "rgb(99, 64, 113)");
  ctx.fillStyle = gradient;    
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function render(){
  clock.render(ctx2, time, canvas);
  playerBoxes.render(ctx2, canvas);
  player.render(ctx2);
  enemiesController.render(ctx2,canvas);
}


module.exports = {
  start: start
}