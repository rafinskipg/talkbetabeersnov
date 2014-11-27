var Victor = require('victor');
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

  /*this.sprite = new sprite(opts.image);
  this.sprite.addAnimation('standby', [0], [10,10], 5);
  this.sprite.playAnimation('standby');*/

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
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = 'rgba(33, 42, 250, 1)';
  ctx.arc(this.pos.x, this.pos.y, this.radius, Math.PI*2, false);
  ctx.fill();
  //this.sprite.render(ctx, this.pos.x, this.pos.y, 20, 20, this.angle);

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

module.exports = enemyEntity;