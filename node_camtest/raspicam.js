
var express = require('express'); //익스프레스 모듈 객체선언
var http=require('http'); //http 모듈 객체선언
var app = express(); 
var server = http.createServer(app);
var Raspicam=require("raspicam");



app.use(express.static(__dirname +'/images')); //이게뭐하는건지 자세히알아봐.
var img_flag=0;

var camera =new Raspicam({ //카메라의 옵션을 설정해준다.

	width : 600, //화면의비율인듯.
	height : 420,
	mode : "video",
	output : "video/video1.mp4",
	framerate : 15
	
});

camera.on("start", function(err, timestamp){

	console.log("video start "+timestamp);

});

camera.on("read", function( err, timestamp, filename ) {

	console.log("video captured with filename : " + filename + " at " +timestamp);

});


camera.on("exit", function(timestamp){

		console.log("video child process has exited at" + timestamp);

	
		camera.stop();
		console.log('REstart camera');
		camera.start();
});


camera.start(); //카메라 런

