var loader = new PxLoader();
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

module.exports = {
	addImage: addImage,
	getImage: getImage,
	onLoadComplete: onLoadComplete,
	start: loader.start
}