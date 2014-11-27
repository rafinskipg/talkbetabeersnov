'use strict';

var entities = require('./models/entities');
var utils = require('./utils');
var enemies = [];

function update(dt, players){
  enemies = _.compact(enemies.map(function(enemy){
    if(enemy.alive){
      var playersNear = utils.kNearest(enemy, players, 2, enemy.sightRadius);
      var playersCollide = utils.kNearest(enemy, players, 2, enemy.radius);

      var avoiding = 0, meanX,meanY, dx, dy;
      //Avoid near enemies
      if(playersNear.length > 0){
        meanX = utils.arrayMean(playersNear, function(b){return b.pos.x});
        meanY = utils.arrayMean(playersNear, function(b){return b.pos.y});
        dx = meanX - enemy.pos.x;
        dy = meanY - enemy.pos.y;
        avoiding = (Math.atan2(dx, dy) * 180 / Math.PI) - enemy.angle;
        avoiding += 180;
      }

      if(playersCollide.length > 0 ){
        enemy.alive = false;
        players[0].points += enemy.points;
      }

      enemy.angle += avoiding;
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
  var myimage = new Image();
  myimage.onload = function() {
     var enemyModel = new entities.enemyEntity({
      x: 0,
      y: 0,
      speed: utils.random(60,100),
      points : utils.random(10,100),
      radius: utils.random(40,80),
      angle: utils.random(0, 180),
      name: opts.name,
      text: opts.text,
      image: myimage
    });

    enemies.push(enemyModel);
  }
  myimage.src = opts.image;
 
}

module.exports = {
  addEnemy: addEnemy,
  update: update,
  render: render
}