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