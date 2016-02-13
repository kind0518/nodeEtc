

var http = require("http");


var raspicam = require("raspicam");



var camera = new raspicam({

		mode : "video",
		output : "./video/video.mp4",
		framerate : 25
});


camera.on("start", function( err, timestamp){

		console.log("video started at " +timestamp);
});


camera.on("read", function(err,timestamp,filename){



			console.log("video captured with filename : " + filename+ " at" + timestamp);
});

camera.on("exit", function(timestamp){

				
		camera.stop();
		console.log('REstart camera');
		camera.start();
});

camera.start();
