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