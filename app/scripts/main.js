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
  