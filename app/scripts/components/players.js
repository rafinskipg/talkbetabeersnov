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