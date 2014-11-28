'use strict';

var entities = require('./models/entities');
var utils = require('./utils');
var enemies = [];

function update(dt, player){

  enemies = _.compact(enemies.map(function(enemy){
    if(enemy.alive){
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