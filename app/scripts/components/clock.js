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