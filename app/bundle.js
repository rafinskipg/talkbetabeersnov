(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var loader;
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

function initLoader(){
  loader = new PxLoader(); 
}

module.exports = {
  init: initLoader,
  addImage: addImage,
  getImage: getImage,
	onLoadComplete: onLoadComplete,
	load: function () {
    loader.start();
  }
}
},{}],2:[function(require,module,exports){
'use strict';

function render(ctx, time, canvas){
  var miliseconds = parseInt(time * 1000, 10);
  var seconds = Math.round(miliseconds/ 1000);
  var centesimas = (miliseconds+'').substr(2,4);
  var minutes = Math.floor(seconds / 60);
  
  seconds =(seconds+'').length < 2  ? '0'+seconds : seconds;
  centesimas = centesimas.length < 2  ? '0'+centesimas : centesimas;
  minutes =(minutes+'').length < 2  ? '0'+minutes : minutes;

  var text = minutes + ':'+ seconds +':'+centesimas;

  ctx.font = 'bold ' + canvas.width / 10 + 'px sans-serif';
  
  var dim = ctx.measureText(text);
  var y = (canvas.height - 30) / 2;
  var x = (canvas.width - dim.width) / 2;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.fillText(text, x, y);   
}


module.exports = {
  render: render
}
},{}],3:[function(require,module,exports){
'use strict';

var players;

function init(playersInfo){
  players = playersInfo;
}

function update(turn){

}

function render(ctx, canvas) {
  var x = 30  ;
  var y = 20;

  players.forEach(function(player){
    ctx.font = 'bold 10px sans-serif';
    var dim = ctx.measureText(player.name);
    var dim2 = ctx.measureText(player.points);
    
    ctx.beginPath();
    ctx.rect(x, y, dim.width + 10,  20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(player.name, x + 5, y + 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(x + dim.width + 20, y, dim2.width + 10,  20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(player.points, x + dim.width + 20 + 5, y + 10);
    ctx.closePath();


    y += 25;
  });
}

module.exports = {
  render: render,
  update: update,
  init : init
}
},{}],4:[function(require,module,exports){
'use strict';

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

module.exports = function generate(){
  var indexTitle = _.random(0, titles.length -1);
  var indexName = _.random(0, names.length -1);
  var indexSurName = _.random(0, surnames.length -1);

  return titles[indexTitle] + ' ' + names[indexName] + ' ' + surnames[indexSurName];
}
},{}],5:[function(require,module,exports){
/** YEAH **/
'use strict';

var assetsLoader = require('./assetsLoader');
var clock = require('./components/clock');
var player = require('./player');
var enemiesController = require('./enemiesController');
var playerBoxes = require('./components/players');
var utils = require('./utils');


var then, now, 
  canvas, ctx,
  canvas2, ctx2,
  time, limit = 50, 
  paused = false;


function start(playersInfo){
  player.initialize(playersInfo[0]);
  playerBoxes.init([player.getEntity()]);
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
    update(dt/1000);
    render();
  }

  requestAnimationFrame(loop);
}

function update(dt){
  updateClock(dt);
  enemiesController.update(dt, player.getEntity());
  player.update(dt);
}

function updateClock(dt){
  time += dt;
  if(time > limit){
    endGame();
  }
}

function clear(){
  //Resize clears the canvas and is good when the window is gonna be resized
  //But it's memory expensive
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

module.exports = {
  start: start
}
},{"./assetsLoader":1,"./components/clock":2,"./components/players":3,"./enemiesController":6,"./player":17,"./utils":19}],6:[function(require,module,exports){
'use strict';

var entities = require('./models/entities');
var utils = require('./utils');
var enemies = [];

function update(dt, player){

  enemies = _.compact(enemies.map(function(enemy){
    if(enemy.alive){
      //var playersNear = utils.kNearest(enemy, [player], 2, enemy.sightRadius);
      var playersCollide = utils.kNearest(enemy, [player], 2, enemy.radius);
      var avoiding = 0, meanX, meanY, dx, dy;

      //Avoid near enemies
      /*if(playersNear.length > 0){
        meanX = utils.arrayMean(playersNear, function(b){return b.pos.x});
        meanY = utils.arrayMean(playersNear, function(b){return b.pos.y});
        dx = meanX - enemy.pos.x;
        dy = meanY - enemy.pos.y;
        avoiding = (Math.atan2(dx, dy) * 180 / Math.PI) - enemy.angle;
        avoiding += 180;
      }
      enemy.angle += avoiding;*/

      if(playersCollide.length > 0 ){
        //enemy.alive = false;
        //player.points += enemy.points;
      }

      enemy.update(dt);
      return enemy;
    }
  }));
}

function render(ctx, canvas){
  for(var i = 0; i < enemies.length; i++){
    enemies[i].render(ctx,canvas);
  }
}

function addEnemy(opts){
  var twitterImage = new Image();
  
  twitterImage.onload = function() {
     var enemyModel = new entities.enemyEntity({
      x: 0,
      y: 0,
      speed: utils.random(60,100),
      points : utils.random(10,100),
      radius: utils.random(40,80),
      angle: utils.random(0, 180),
      name: opts.name,
      text: opts.text,
      image: twitterImage
    });

    enemies.push(enemyModel);
  }
  //Load the image
  twitterImage.src = opts.image;
}

module.exports = {
  addEnemy: addEnemy,
  update: update,
  render: render
}
},{"./models/entities":12,"./utils":19}],7:[function(require,module,exports){
'use strict';
var core = require('./core');
var utils = require('./utils');
var enemiesController = require('./enemiesController');
var randomNameGenerator = require('./components/randomNameGenerator');
var socket, gameIdentificator, playerInfo;


function init(){
  playerInfo = { name : randomNameGenerator(), id: utils.randomId() };

  socket = io('http://127.0.0.1:3000');

  //Request play vs AI
  $('.vsAI').on('click', function(){
    $('.waiting').removeClass('hidden');
    socket.emit('request_play_AI', playerInfo);
  });

  //Start game
  socket.on('start_game', function(game){
    gameIdentificator = game.id;
    $('.waiting').addClass('hidden');
    $('.websocketsInfo').addClass('hidden');
    core.start(game.players);
  });

  //Render user list
  socket.on('refresh_user_list', function(users){
    var content = $('<div ></div>');
    users.forEach(function(user){
      content.append('<div class="list-group-item">'+ user.name + '</div>');
    })
    $('.users').html(content);
  });

  //Emit connected
  socket.emit('user_connected', playerInfo);

  //Push enemy
  /*socket.on('new_enemy', function(enemy){
    console.log('new enemy connected');
    enemiesController.addEnemy(enemy);
  });*/

}


module.exports = {
  init: init
}
},{"./components/randomNameGenerator":4,"./core":5,"./enemiesController":6,"./utils":19}],8:[function(require,module,exports){
'use strict';

var pressedKeys = {};

function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch(code) {
    case 32:
        key = 'SPACE'; break;
    case 37:
        key = 'LEFT'; break;
    case 38:
        key = 'UP'; break;
    case 39:
        key = 'RIGHT'; break;
    case 40:
        key = 'DOWN'; break;
    default:
        // Convert ASCII codes to letters
        key = String.fromCharCode(code);
    }

    pressedKeys[key] = status;
}

document.addEventListener('keydown', function(e) {
    setKey(e, true);
});

document.addEventListener('keyup', function(e) {
    setKey(e, false);
});

window.addEventListener('blur', function() {
    pressedKeys = {};
});

var input = {
    isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
    },
    addKey : function(code){
        pressedKeys[code.toUpperCase()] = true;
    },
    removeKey: function(code){
        pressedKeys[code.toUpperCase()] =  false;
    }
};

module.exports = input;
},{}],9:[function(require,module,exports){
/*
  Start endpoint
 */

var gameConnection = require('./gameConnection');
var assetsLoader = require('./assetsLoader');

$(document).ready(function(){
  assetsLoader.init();
  assetsLoader.addImage('images/sprite.png', 'playerSprite');
  assetsLoader.onLoadComplete(function(){
    gameConnection.init();
  });
  assetsLoader.load();

});
  
},{"./assetsLoader":1,"./gameConnection":7}],10:[function(require,module,exports){
var Victor = require('victor');
var utils = require('../utils');
var sprite = require('../sprite');
var entity = require('./entity');
var assetsLoader = require('../assetsLoader');

function birdEntity(opts){
  opts.x = opts.x || 100;
  opts.y = opts.y || window.innerHeight/2;
  opts.speedY = opts.speed || -200;
  opts.speedX = opts.speed || -200;

  entity.prototype.constructor.call(this, opts);
  this.color = opts.color || 'black';
  this.colorFancy = utils.randomRGBColor();
  this.angle = opts.angle || 0;
  this.destinyAngle = this.angle;
  this.size = opts.size || 10;
 
  this.sprite = new sprite(window.backgroundImg);
  this.sprite.addAnimation('flap', [0,1,2,1,0,1,2,3,4,5], [10,10], 5);
  this.sprite.playAnimation('flap');
}
birdEntity.prototype = new entity({x: 0, y : 0});

birdEntity.prototype.getRepulsionRadius = function(){
  return window.SETTINGS.birdRepulsionRadius.value;
}
birdEntity.prototype.getAligmentRadius = function(){
  return window.SETTINGS.birdAlignmentRadius.value;
}
birdEntity.prototype.getAttractionRadius = function(){
  return window.SETTINGS.birdAttractionRadius.value;
}
birdEntity.prototype.getSightRadius = function(){
  return window.SETTINGS.birdSightRadius.value;
}

birdEntity.prototype.getSpeed = function(){
  return window.SETTINGS.birdSpeed.value;
}

birdEntity.prototype.constructor = birdEntity;
birdEntity.prototype.parent = entity.prototype;

birdEntity.prototype.render = function(ctx){

  if( window.SETTINGS.debugging.value == 3 ){
    //Attraction  zone
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(42, 250, 33, 0.30)';
    ctx.arc(this.pos.x, this.pos.y, this.getAttractionRadius(), Math.PI*2, false);
    ctx.stroke();
  }

  if( window.SETTINGS.debugging.value == 2 || window.SETTINGS.debugging.value == 3 ){
    //Alignment  zone
    ctx.beginPath();
    ctx.fillStyle = 'rgba(33, 42, 250, 0.20)';
    ctx.arc(this.pos.x, this.pos.y, this.getAligmentRadius(), Math.PI*2, false);
    ctx.fill();
  }
  if(window.SETTINGS.debugging.value == 1 || window.SETTINGS.debugging.value == 2 || window.SETTINGS.debugging.value == 3 ){
    //Repulsion zone
    ctx.beginPath();
    ctx.fillStyle = 'rgba(250, 33, 33, 0.30)';
    ctx.arc(this.pos.x, this.pos.y, this.getRepulsionRadius(), Math.PI*2, false);
    ctx.fill();
  }

  //Bird
  ctx.fillStyle = this.leader === true ? 'red' : this.color;

  if(window.SETTINGS.debugging.value == 4){
    ctx.beginPath();
    this.opacity = 0.8;
    //a gradient instead of white fill
    var gradient = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.size);
    gradient.addColorStop(0, "rgba("+this.colorFancy.r+", "+this.colorFancy.g+", "+this.colorFancy.b+", "+this.opacity+")");
    gradient.addColorStop(0.5, "rgba("+this.colorFancy.r+", "+this.colorFancy.g+", "+this.colorFancy.b+", "+this.opacity+")");
    gradient.addColorStop(1, "rgba("+this.colorFancy.r+", "+this.colorFancy.g+", "+this.colorFancy.b+", 0)");
    ctx.fillStyle = gradient;
    ctx.arc(this.pos.x, this.pos.y, this.size, Math.PI*2, false);
    ctx.fill();   
  }

  this.sprite.render(ctx, this.pos.x, this.pos.y, 20, 20, this.angle);

}

birdEntity.prototype.update = function(dt){
  this.sprite.update(dt);
  
  //Only applies for leaders
  if(this.destinyAngle && this.destinyAngle != this.angle){
    if(this.angle < this.destinyAngle){
      this.angle = (this.angle + dt) > this.destinyAngle ? this.destinyAngle : (this.angle + dt);
    }else{
      this.angle = (this.angle - dt) < this.destinyAngle ? this.destinyAngle : (this.angle - dt);
    }
    //Uncomment for weird movement
    //this.angle = this.destinyAngle * dt;
    //this.speed.rotateDeg(this.angle);
  }
  
  var speedDt = new Victor(this.getSpeed(), this.getSpeed()).multiply(new Victor(dt, dt)).rotateDeg(this.angle);
  
  this.pos = this.pos.add(speedDt);

  //Check borders
  if(this.pos.x > window.innerWidth){
    this.pos.x = 0;
  }else if(this.pos.x < 0){
    this.pos.x = window.innerWidth;
  }
  if(this.pos.y > window.innerHeight){
    this.pos.y = 0;
  }else if(this.pos.y < 0){
    this.pos.y = window.innerHeight;
  }
}

module.exports = birdEntity;
},{"../assetsLoader":1,"../sprite":18,"../utils":19,"./entity":13,"victor":20}],11:[function(require,module,exports){
var Victor = require('victor');
var sprite = require('../sprite');
var utils = require('../utils');
var entity = require('./entity');

function enemyEntity(opts){
  opts.x = opts.x || 100;
  opts.y = opts.y || window.innerHeight/2;
  opts.speedY = opts.speed || -200;
  opts.speedX = opts.speed || -200;

  entity.prototype.constructor.call(this, opts);
  this.color = opts.color || 'black';
  this.alive = true;
  this.points = opts.points || 10;
  this.angle = opts.angle || 0;
  this.destinyAngle = this.angle;
  this.radius = opts.radius || 10;
  this.name = '@'+opts.name;
  this.image = opts.image;
  this.text = opts.text;

  this.sprite = new sprite(opts.image);
  this.sprite.addAnimation('standby', [0], [opts.image.width, opts.image.height], 5);
  this.sprite.playAnimation('standby');

  this.sightRadius = utils.random(10, 200);
}

enemyEntity.prototype = new entity({x: 0, y : 0});

enemyEntity.prototype.constructor = enemyEntity;
enemyEntity.prototype.parent = entity.prototype;

enemyEntity.prototype.render = function(ctx){
  //Alignment  zone
  ctx.beginPath();
  ctx.fillStyle = 'rgba(33, 42, 250, 0.20)';
  ctx.arc(this.pos.x, this.pos.y, this.sightRadius, Math.PI*2, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = 'rgba(33, 42, 250, 0.4)';
  ctx.arc(this.pos.x, this.pos.y, this.radius, Math.PI*2, false);
  ctx.stroke();
  
  //Render image
  this.sprite.render(ctx, this.pos.x, this.pos.y, this.radius, this.radius, this.angle);

  ctx.font = 'bold 15px sans-serif';
  var dim = ctx.measureText(this.name);
  //Name bg
  ctx.beginPath();
  ctx.rect(this.pos.x - dim.width / 2 -10, this.pos.y + 30, dim.width + 20,  20);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();
  ctx.closePath();

  //Twitter name
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillText(this.name,this.pos.x - dim.width / 2, this.pos.y + 40);
  ctx.closePath();

}

enemyEntity.prototype.update = function(dt){
  //this.sprite.update(dt);
  
  //Only applies for leaders
  if(this.destinyAngle && this.destinyAngle != this.angle){
    if(this.angle < this.destinyAngle){
      this.angle = (this.angle + dt) > this.destinyAngle ? this.destinyAngle : (this.angle + dt);
    }else{
      this.angle = (this.angle - dt) < this.destinyAngle ? this.destinyAngle : (this.angle - dt);
    }
    //Uncomment for weird movement
    //this.angle = this.destinyAngle * dt;
    //this.speed.rotateDeg(this.angle);
  }
  
  var speedDt = new Victor(this.speed.x, this.speed.y).multiply(new Victor(dt, dt)).rotateDeg(this.angle);  
  this.pos = this.pos.add(speedDt);

  //Check borders
  if(this.pos.x > window.innerWidth){
    this.pos.x = 0;
  }else if(this.pos.x < 0){
    this.pos.x = window.innerWidth;
  }
  if(this.pos.y > window.innerHeight){
    this.pos.y = 0;
  }else if(this.pos.y < 0){
    this.pos.y = window.innerHeight;
  }
}

module.exports = enemyEntity;
},{"../sprite":18,"../utils":19,"./entity":13,"victor":20}],12:[function(require,module,exports){
var entity = require('./entity');
var textEntity = require('./textEntity');
var birdEntity = require('./birdEntity');
var particleEntity = require('./particleEntity');
var enemyEntity = require('./enemyEntity');

module.exports = {
  entity: entity,
  textEntity: textEntity,
  particleEntity: particleEntity,
  birdEntity: birdEntity,
  enemyEntity: enemyEntity
}
},{"./birdEntity":10,"./enemyEntity":11,"./entity":13,"./particleEntity":14,"./textEntity":16}],13:[function(require,module,exports){
var Victor = require('victor');

function entity(opts){
  this.pos = new Victor(opts.x,opts.y);
  this.speed = new Victor(opts.speedX || 0, opts.speedY || 0);
  this.acceleration = new Victor(opts.accX || 0, opts.accY || 0);
}

entity.prototype.update = function(dt){
  this.speed.add(this.acceleration);
  var speedDt = new Victor(this.speed.x, this.speed.y).multiply(new Victor(dt, dt));
  this.pos = this.pos.add(speedDt);
}

entity.prototype.render = function(ctx){
  //Implement
}

module.exports = entity;
},{"victor":20}],14:[function(require,module,exports){
var Victor = require('victor');
var entity = require('./entity');
var utils = require('../utils');

function particleEntity(opts){
  entity.prototype.constructor.call(this, opts);
  this.color = opts.color || {r:0, g: 0, b: 0};
  this.mass = opts.mass || 1;
  this.angle = opts.angle || 0;
  this.radius = opts.radius || 5;
  this.life = opts.life || 200;
  this.remaining_life = this.life;
  this.opacity = 1;
  this.operator = utils.flipCoin() ? 1 : -1;
}

particleEntity.prototype = new entity({x: 0, y : 0});
particleEntity.prototype.constructor = particleEntity;
particleEntity.prototype.parent = entity.prototype;

particleEntity.prototype.render = function(ctx){

  ctx.beginPath();
  this.opacity = Math.round(this.remaining_life/this.life*100)/100
  //a gradient instead of white fill
  var gradient = ctx.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
  gradient.addColorStop(0, "rgba("+this.color.r+", "+this.color.g+", "+this.color.b+", "+this.opacity+")");
  gradient.addColorStop(0.5, "rgba("+this.color.r+", "+this.color.g+", "+this.color.b+", "+this.opacity+")");
  gradient.addColorStop(1, "rgba("+this.color.r+", "+this.color.g+", "+this.color.b+", 0)");
  ctx.fillStyle = gradient;
  ctx.arc(this.pos.x, this.pos.y, this.radius, Math.PI*2, false);
  ctx.fill();

  if(!this.dying){
    if(this.remaining_life < 0 ){
      this.operator = 1;
    }else if(this.remaining_life > this.life){
      this.operator = -1;
    }

    this.operator < 0 ? this.remaining_life-- : this.remaining_life++;
  }else{
    this.remaining_life--;
  }
}

module.exports = particleEntity;
},{"../utils":19,"./entity":13,"victor":20}],15:[function(require,module,exports){
var entity = require('./entity');
var sprite = require('../sprite');
var assetsLoader = require('../assetsLoader');
var Victor = require('victor');

function Player(opts){
  entity.prototype.constructor.call(this, opts);
  this.mass = opts.mass || 1;
  this.angle = opts.angle || 0;
  this.name = opts.name;
  this.points = 0;
  this.radius = opts.radius || 5;
  this.life = opts.life || 200;
  this.remaining_life = this.life;
  this.maxSpeed = opts.maxSpeed || 200;
  this.sprite = new sprite(assetsLoader.getImage('playerSprite'));
  this.sprite.addAnimation('flap', [0,1,2,1,0,1,2], [160,200], 1000);
  this.sprite.playAnimation('flap');
}

Player.prototype.render = function(ctx){
  this.sprite.render(ctx, this.pos.x, this.pos.y, 50, 50, this.angle);
}

Player.prototype.update = function(dt){
  this.sprite.update(dt);
  if((this.speed.x < this.maxSpeed && this.acceleration.x > 0)  || this.acceleration.x < 0){
    this.speed.add(this.acceleration);
  }

  if(this.destinyAngle != null && this.destinyAngle != this.angle){
    if(this.angle < this.destinyAngle){
      this.angle = (this.angle + dt * 100) > this.destinyAngle ? this.destinyAngle : (this.angle + dt* 100 );
    }else{
      this.angle = (this.angle - dt * 100) < this.destinyAngle ? this.destinyAngle : (this.angle - dt* 100);
    }
  }

  var speedDt = new Victor(this.speed.x, this.speed.y).multiply(new Victor(dt, dt)).rotateDeg(this.angle);
  
  this.pos = this.pos.add(speedDt);

  //Check borders
  if(this.pos.x > window.innerWidth){
    this.pos.x = 0;
  }else if(this.pos.x < 0){
    this.pos.x = window.innerWidth;
  }
  if(this.pos.y > window.innerHeight){
    this.pos.y = 0;
  }else if(this.pos.y < 0){
    this.pos.y = window.innerHeight;
  }
}

module.exports = Player;
},{"../assetsLoader":1,"../sprite":18,"./entity":13,"victor":20}],16:[function(require,module,exports){
var Victor = require('victor');
var entity = require('./entity');

function textEntity(opts){
  opts.x = opts.x || 100;
  opts.y = opts.y || window.innerHeight;
  opts.speedY = opts.speedY || -200;

  entity.prototype.constructor.call(this, opts);
  this.color = opts.color || 'white';
  this.font = opts.font || '40px Indie Flower';
  this.text = opts.text || 'test text';
}

textEntity.prototype = new entity({x: 0, y : 0});
textEntity.prototype.constructor = textEntity;
textEntity.prototype.parent = entity.prototype;

textEntity.prototype.render = function(ctx){
  ctx.fillStyle = this.color;
  ctx.font = this.font;
  if(typeof(this.text) == 'object'){
    for(var i = 0; i < this.text.length; i++){
      this.printText(ctx,this.text[i], this.pos.y + (70 * i));
    }
  }else{
    this.printText(ctx,this.text, this.pos.y);
  }
}

textEntity.prototype.printText = function(ctx, text, posY){
  var textWidth = ctx.measureText(text).width;
  ctx.fillText(text , (window.innerWidth/2) - (textWidth / 2), posY);
}

textEntity.prototype.getTextHeight = function(){
  if(typeof(this.text) == 'object'){
    var amount = 50 * this.text.length;
    return amount;
  }else{
    return 40;
  }
}

module.exports = textEntity;
},{"./entity":13,"victor":20}],17:[function(require,module,exports){
var Player = require('./models/playerModel');
var input = require('./input');

var player;

function initialize(opts){
  player = new Player({
    x: window.innerWidth / 2,
    y:  100,
    speedX : 10,
    speedY : 10,
    angle: 90,
    maxSpeed: 200,
    name : opts.name
  });
}

function update(dt){
  var desiredAngle = null;
  if(input.isDown('w') || input.isDown('UP')){

    desiredAngle = -90;
    if(input.isDown('d') || input.isDown('RIGHT')){
      desiredAngle -= 45;
    }

    if(input.isDown('a') || input.isDown('LEFT')){
      desiredAngle += 45;
    }
  }else if(input.isDown('s') || input.isDown('DOWN')){
    desiredAngle = 90;

    if(input.isDown('d') || input.isDown('RIGHT')){
      desiredAngle += 45;
    }

    if(input.isDown('a') || input.isDown('LEFT')){
      desiredAngle -= 45;
    }
  }else{
    if(input.isDown('d') || input.isDown('RIGHT')){
      desiredAngle = 0;
    }else if(input.isDown('a') || input.isDown('LEFT')){
      desiredAngle = -180;
    }
  }

  if(input.isDown('SPACE') ){
    player.acceleration.x = 1;
    player.acceleration.y = 1;
  }else if(player.speed.x > 10){
    player.acceleration.x -= dt * 10;
    player.acceleration.y -= dt * 10;
  }else{
    player.acceleration.x = 0;
    player.acceleration.y = 0;
  }
  player.destinyAngle = desiredAngle;

  player.update(dt);
}

function render(ctx){
  //Render circle
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(42, 250, 33, 0.50)';
  ctx.arc(player.pos.x, player.pos.y, 30 , Math.PI*2, false);
  ctx.stroke();

  player.render(ctx);
}

module.exports = {
  update: update,
  render: render,
  initialize: initialize,
  getEntity: function(){
    return player;
  }
}
},{"./input":8,"./models/playerModel":15}],18:[function(require,module,exports){
function Sprite(img){
	this.img = img;
	this.animations = {};
}

Sprite.prototype.addAnimation = function (name, frames, size, duration, pos, direction){
	pos = pos ? pos : [0,0];
	direction = direction ? direction : 'horizontal';

	this.animations[name] = {
		frames: frames,
		frameTime: duration/1000/frames.length,
		size: size,
		direction: direction,
		pos: pos,
		frameIndex : 0,
		frameDt : 0
	}
}

Sprite.prototype.playAnimation = function (name, reset){
	this.currentAnimation = name;
	if(reset){
		this.animations[name].frameIndex = 0;
		this.animations[name].frameDt = 0;
	}
}

Sprite.prototype.update = function(dt){
	var currentAnimation = this.animations[this.currentAnimation];
	if(currentAnimation){
		currentAnimation.frameDt += dt;
		if(currentAnimation.frameDt >= currentAnimation.frameTime){
      currentAnimation.frameDt = 0;
			currentAnimation.frameIndex = currentAnimation.frameIndex < (currentAnimation.frames.length - 1) ? currentAnimation.frameIndex + 1 : 0;
		}
	}
}

Sprite.prototype.render = function(ctx, x, y, resizeX, resizeY, angle){
	var currentAnimation = this.animations[this.currentAnimation];
	if(currentAnimation){
		var width = resizeX ? resizeX : currentAnimation.size[0];
		var height = resizeY ? resizeY : currentAnimation.size[1];
	  
    ctx.save();
    ctx.translate(x,y);

    if(angle){   
      ctx.rotate(angle * Math.PI / 180);
    }

		ctx.drawImage(
      this.img,
      currentAnimation.pos[0] + (currentAnimation.size[0] * currentAnimation.frames[currentAnimation.frameIndex]),
      currentAnimation.pos[1],
      currentAnimation.size[0],
      currentAnimation.size[1],
      - width/2, -height/2,
      width,
      height
    );

    if(angle){
      ctx.translate(-width/2, -height/2) ; 
    }
    
    ctx.restore();
	}
	
}

module.exports = Sprite;
},{}],19:[function(require,module,exports){
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

function randomId() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
}

function flipCoin() {
    return (Math.floor(Math.random() * 2) == 0);
}

//Calculates the mean of the array a1 on the field idx
function arrayMean (a1, extractor) {
  'use strict';
  var result, i;

  result = 0;
  for (i = 0; i < a1.length; i += 1) {
      result += extractor(a1[i]);
  }
  result /= a1.length;
  return result;
};

function kNearest(a1, lst, k, maxDist) {
  'use strict';
  var result = [], tempDist = [], idx = 0, worstIdx = -1, dist, agent;

  while (idx < lst.length) {
      agent = lst[idx];
      if (a1 !== agent) {
          dist = a1.pos.distance(agent.pos);
          if (dist < maxDist) {
              if (result.length < k) {
                  result.push(agent);
                  tempDist.push(dist);
                  worstIdx = tempDist.indexOf(_.max(tempDist));
              } else {
                  if (dist < tempDist[worstIdx]) {
                      tempDist[worstIdx] = dist;
                      result[worstIdx] = agent;
                      worstIdx = tempDist.indexOf(_.max(tempDist));
                  }
              }
          }
      }

      idx += 1;
  }

    return result;
};

module.exports = {
  random: random,
  randomColor: randomColor,
  randomRGBColor: randomRGBColor,
  flipCoin: flipCoin,
  arrayMean: arrayMean,
  kNearest: kNearest,
  randomId: randomId
}
},{}],20:[function(require,module,exports){
exports = module.exports = Victor;

/**
 * # Victor - A JavaScript 2D vector class with methods for common vector operations
 */

/**
 * Constructor. Will also work without the `new` keyword
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = Victor(42, 1337);
 *
 * @param {Number} x Value of the x axis
 * @param {Number} y Value of the y axis
 * @return {Victor}
 * @api public
 */
function Victor (x, y) {
	if (!(this instanceof Victor)) {
		return new Victor(x, y);
	}

	/**
	 * The X axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.x;
	 *     // => 42
	 *
	 * @api public
	 */
	this.x = x || 0;

	/**
	 * The Y axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.y;
	 *     // => 21
	 *
	 * @api public
	 */
	this.y = y || 0;
};

/**
 * # Static
 */

/**
 * Creates a new instance from an array
 *
 * ### Examples:
 *     var vec = Victor.fromArray([42, 21]);
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromArray
 * @param {Array} array Array with the x and y values at index 0 and 1 respectively
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromArray = function (arr) {
	return new Victor(arr[0] || 0, arr[1] || 0);
};

/**
 * Creates a new instance from an object
 *
 * ### Examples:
 *     var vec = Victor.fromObject({ x: 42, y: 21 });
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromObject
 * @param {Object} obj Object with the values for x and y
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromObject = function (obj) {
	return new Victor(obj.x || 0, obj.y || 0);
};

/**
 * # Manipulation
 *
 * These functions are chainable.
 */

/**
 * Adds another vector's X axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addX(vec2);
 *     vec1.toString();
 *     // => x:30, y:10
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addX = function (vec) {
	this.x += vec.x;
	return this;
};

/**
 * Adds another vector's Y axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addY(vec2);
 *     vec1.toString();
 *     // => x:10, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addY = function (vec) {
	this.y += vec.y;
	return this;
};

/**
 * Adds another vector to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.add(vec2);
 *     vec1.toString();
 *     // => x:30, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.add = function (vec) {
	this.x += vec.x;
	this.y += vec.y;
	return this;
};

/**
 * Subtracts the X axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractX(vec2);
 *     vec1.toString();
 *     // => x:80, y:50
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractX = function (vec) {
	this.x -= vec.x;
	return this;
};

/**
 * Subtracts the Y axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractY(vec2);
 *     vec1.toString();
 *     // => x:100, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractY = function (vec) {
	this.y -= vec.y;
	return this;
};

/**
 * Subtracts another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtract(vec2);
 *     vec1.toString();
 *     // => x:80, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtract = function (vec) {
	this.x -= vec.x;
	this.y -= vec.y;
	return this;
};

/**
 * Divides the X axis by the x component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.divideX(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideX = function (vector) {
	this.x /= vector.x;
	return this;
};

/**
 * Divides the Y axis by the y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.divideY(vec2);
 *     vec.toString();
 *     // => x:100, y:25
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideY = function (vector) {
	this.y /= vector.y;
	return this;
};

/**
 * Divides both vector axis by a axis values of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.divide(vec2);
 *     vec.toString();
 *     // => x:50, y:25
 *
 * @param {Victor} vector The vector to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divide = function (vector) {
	this.x /= vector.x;
	this.y /= vector.y;
	return this;
};

/**
 * Inverts the X axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertX();
 *     vec.toString();
 *     // => x:-100, y:50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertX = function () {
	this.x *= -1;
	return this;
};

/**
 * Inverts the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertY();
 *     vec.toString();
 *     // => x:100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertY = function () {
	this.y *= -1;
	return this;
};

/**
 * Inverts both axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invert();
 *     vec.toString();
 *     // => x:-100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invert = function () {
	this.invertX();
	this.invertY();
	return this;
};

/**
 * Multiplies the X axis by X component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:200, y:50
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyX = function (vector) {
	this.x *= vector.x;
	return this;
};

/**
 * Multiplies the Y axis by Y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:100, y:100
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyY = function (vector) {
	this.y *= vector.y;
	return this;
};

/**
 * Multiplies both vector axis by values from a given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.multiply(vec2);
 *     vec.toString();
 *     // => x:200, y:100
 *
 * @param {Victor} vector The vector to multiply by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiply = function (vector) {
	this.x *= vector.x;
	this.y *= vector.y;
	return this;
};

/**
 * Normalize
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.normalize = function () {
	var length = this.length();

	if (length === 0) {
		this.x = 1;
		this.y = 0;
	} else {
		this.divide(Victor(length, length));
	}
	return this;
};

Victor.prototype.norm = Victor.prototype.normalize;

/**
 * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.limit(80, 0.9);
 *     vec.toString();
 *     // => x:90, y:50
 *
 * @param {Number} max The maximum value for both x and y axis
 * @param {Number} factor Factor by which the axis are to be multiplied with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.limit = function (max, factor) {
	if (Math.abs(this.x) > max){ this.x *= factor; }
	if (Math.abs(this.y) > max){ this.y *= factor; }
	return this;
};

/**
 * Randomizes both vector axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:67, y:73
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomize = function (topLeft, bottomRight) {
	this.randomizeX(topLeft, bottomRight);
	this.randomizeY(topLeft, bottomRight);

	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:55, y:50
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeX = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.x, bottomRight.x);
	var max = Math.max(topLeft.x, bottomRight.x);
	this.x = random(min, max);
	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:100, y:66
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeY = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.y, bottomRight.y);
	var max = Math.max(topLeft.y, bottomRight.y);
	this.y = random(min, max);
	return this;
};

/**
 * Randomly randomizes either axis between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
 *     vec.toString();
 *     // => x:100, y:77
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
	if (!! Math.round(Math.random())) {
		this.randomizeX(topLeft, bottomRight);
	} else {
		this.randomizeY(topLeft, bottomRight);
	}
	return this;
};

/**
 * Rounds both axis to an integer value
 *
 * ### Examples:
 *     var vec = new Victor(100.2, 50.9);
 *
 *     vec.unfloat();
 *     vec.toString();
 *     // => x:100, y:51
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.unfloat = function () {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
};

/**
 * Performs a linear blend / interpolation of the X axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixX(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:100
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixX = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.x = (1 - amount) * this.x + amount * vec.x;
	return this;
};

/**
 * Performs a linear blend / interpolation of the Y axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixY(vec2, 0.5);
 *     vec.toString();
 *     // => x:100, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixY = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.y = (1 - amount) * this.y + amount * vec.y;
	return this;
};

/**
 * Performs a linear blend / interpolation towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mix(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mix = function (vec, amount) {
	this.mixX(vec, amount);
	this.mixY(vec, amount);
	return this;
};

/**
 * # Products
 */

/**
 * Creates a clone of this vector
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = vec1.clone();
 *
 *     vec2.toString();
 *     // => x:10, y:10
 *
 * @return {Victor} A clone of the vector
 * @api public
 */
Victor.prototype.clone = function () {
	return new Victor(this.x, this.y);
};

/**
 * Copies another vector's X component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyX(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:10
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyX = function (vec) {
	this.x = vec.x;
	return this;
};

/**
 * Copies another vector's Y component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyY(vec1);
 *
 *     vec2.toString();
 *     // => x:10, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyY = function (vec) {
	this.y = vec.y;
	return this;
};

/**
 * Copies another vector's X and Y components in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copy(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copy = function (vec) {
	this.copyX(vec);
	this.copyY(vec);
	return this;
};

/**
 * Sets the vector to zero (0,0)
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *		 var1.zero();
 *     vec1.toString();
 *     // => x:0, y:0
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.zero = function () {
	this.x = this.y = 0;
	return this;
};

/**
 * Calculates the dot product of this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.dot(vec2);
 *     // => 23000
 *
 * @param {Victor} vector The second vector
 * @return {Number} Dot product
 * @api public
 */
Victor.prototype.dot = function (vec2) {
	return this.x * vec2.x + this.y * vec2.y;
};

Victor.prototype.cross = function (vec2) {
	return (this.x * vec2.y ) - (this.y * vec2.x );
};

/**
 * Projects a vector onto another vector, setting itself to the result.
 *
 * ### Examples:
 *     var vec = new Victor(100, 0);
 *     var vec2 = new Victor(100, 100);
 *
 *     vec.projectOnto(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want to project this vector onto
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.projectOnto = function (vec2) {
    var coeff = ( (this.x * vec2.x)+(this.y * vec2.y) ) / ((vec2.x*vec2.x)+(vec2.y*vec2.y));
    this.x = coeff * vec2.x;
    this.y = coeff * vec2.y;
    return this;
};


Victor.prototype.horizontalAngle = function () {
	return Math.atan2(this.y, this.x);
};

Victor.prototype.horizontalAngleDeg = function () {
	return radian2degrees(this.horizontalAngle());
};

Victor.prototype.verticalAngle = function () {
	return Math.atan2(this.x, this.y);
};

Victor.prototype.verticalAngleDeg = function () {
	return radian2degrees(this.verticalAngle());
};

Victor.prototype.angle = Victor.prototype.horizontalAngle;
Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
Victor.prototype.direction = Victor.prototype.horizontalAngle;

Victor.prototype.rotate = function (angle) {
	var nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
	var ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

	this.x = nx;
	this.y = ny;

	return this;
};

Victor.prototype.rotateDeg = function (angle) {
	angle = degrees2radian(angle);
	return this.rotate(angle);
};

Victor.prototype.rotateBy = function (rotation) {
	var angle = this.angle() + rotation;

	return this.rotate(angle);
};

Victor.prototype.rotateByDeg = function (rotation) {
	rotation = degrees2radian(rotation);
	return this.rotateBy(rotation);
};

/**
 * Calculates the distance of the X axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceX(vec2);
 *     // => -100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceX = function (vec) {
	return this.x - vec.x;
};

/**
 * Same as `distanceX()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.absDistanceX(vec2);
 *     // => 100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceX = function (vec) {
	return Math.abs(this.distanceX(vec));
};

/**
 * Calculates the distance of the Y axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => -10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceY = function (vec) {
	return this.y - vec.y;
};

/**
 * Same as `distanceY()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => 10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceY = function (vec) {
	return Math.abs(this.distanceY(vec));
};

/**
 * Calculates the euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distance(vec2);
 *     // => 100.4987562112089
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distance = function (vec) {
	return Math.sqrt(this.distanceSq(vec));
};

/**
 * Calculates the squared euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceSq(vec2);
 *     // => 10100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceSq = function (vec) {
	var dx = this.distanceX(vec),
		dy = this.distanceY(vec);

	return dx * dx + dy * dy;
};

/**
 * Calculates the length or magnitude of the vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.length();
 *     // => 111.80339887498948
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.length = function () {
	return Math.sqrt(this.lengthSq());
};

/**
 * Squared length / magnitude
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.lengthSq();
 *     // => 12500
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.lengthSq = function () {
	return this.x * this.x + this.y * this.y;
};

Victor.prototype.magnitude = Victor.prototype.length;

/**
 * Returns a true if vector is (0, 0)
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     vec.zero();
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isZero = function() {
	return this.x === 0 && this.y === 0;
};

/**
 * Returns a true if this vector is the same as another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(100, 50);
 *     vec1.isEqualTo(vec2);
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isEqualTo = function(vec2) {
	return this.x === vec2.x && this.y === vec2.y;
};

/**
 * # Utility Methods
 */

/**
 * Returns an string representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toString();
 *     // => x:10, y:20
 *
 * @return {String}
 * @api public
 */
Victor.prototype.toString = function () {
	return 'x:' + this.x + ', y:' + this.y;
};

/**
 * Returns an array representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toArray();
 *     // => [10, 20]
 *
 * @return {Array}
 * @api public
 */
Victor.prototype.toArray = function () {
	return [ this.x, this.y ];
};

/**
 * Returns an object representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toObject();
 *     // => { x: 10, y: 20 }
 *
 * @return {Object}
 * @api public
 */
Victor.prototype.toObject = function () {
	return { x: this.x, y: this.y };
};


var degrees = 180 / Math.PI;

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function radian2degrees (rad) {
	return rad * degrees;
}

function degrees2radian (deg) {
	return deg / degrees;
}

},{}]},{},[9]);
