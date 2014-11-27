/** YEAH **/
'use strict';

var assetsLoader = require('./assetsLoader');
var clock = require('./components/clock');
var settings = require('./settings');
var player = require('./player');
var enemiesController = require('./enemiesController');
var playerBoxes = require('./components/players');
var utils = require('./utils');


var song, then, now, canvas,ctx, shown,  color, time, limit = 30, paused = false, maxTries = 30, tries = 0;


function start(playersInfo){
  playerBoxes.init(playersInfo);
  player.initialize();
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
  enemiesController.update(newDt);
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
  player.render(ctx);
  enemiesController.render(ctx,canvas);
}


module.exports = {
  start: start
}