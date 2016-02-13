
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
	mode : 'timelapse',
	awb : 'off',
	encoding : 'jpg',
	output : 'images/camera.jpg',
	q : 50,
	t : 10000, 
	tl : 0,
	nopreview : true,
	th : '0:0:0'
});

/*
카메라의 옵션을 설정해주는 부분입니다.
핵심은 width, height, mode, encoding , output, timeout, timelapse입니다.
폭은 600, 높이는 420으로 timelapse 방식으로 사진을 찍습니다.
0초에 1번(최소시간)찍으며 10초뒤 종료됩니다.
인코딩 방식은 jpg, 그리고 출력(저장위치)는 images/camera.jpg로 합니다.
그 외 noprevie는 프리뷰를 설정하느냐 마느냐이며, th는 thumbnail값을 성정해주는 부분입니다.
q는 사진의 퀄리티를 뜻하며, 여기선 50%를 사용했습니다.
awb는 자외선 수치를 설정하는 것으로 확인됩니다.
off, auto, sun, cloud등이 있으며 자세한 내용은 아래 링크에서 확인이 가능합니다.
&&&&
https://github.com/troyth/node-raspicam

*/


camera.start(); //카메라 런

camera.on('exit', function() {


	camera.stop();
	console.log('REstart camera');
	camera.start();
});


//카메라를 시작한다. camera.on('exit'~~부분은 카메라가 종료되었을 때 실행이 된다.
//카메라가 시작된지 10초가 지나 timeout이 되면 종료되는데 이때 카메라를 정지하고 다시 시작한다.

camera.on('read', function() {

	img_flag=1;
});

//read함수는 timelapse 기능으로 사진이 저장되었을 때 실행된다.
//즉 이부분에서 화상전송된 부분이 바뀌었음을 알 수 있다.



app.get('/cam', function(req,res){


	res.sendfile('cam.html', {root:__dirname});

});


app.get('/images', function (req,res) {

	console.log('get/img'); //이미지 요청이 들어왔을 경우에
		if(img_flag==1){ //플래그가 1이라면, 사진에 '변화'가 생긴 것이므로, 파일을 보내준다.
					    //만약,플래그가 0인 상태인데 요청이 들어왔다고 보내준다면, 쓸데없는 파일을 보내주는 것이 되는 셈이다.
		
			img_flag=0; //플래그를 0으로 초기화해주고
			res.sendfile('images/camera.jpg'); //파일을 보낸다. sendfile함수를 이용해서. 해당파일은 이미지 파일이다.
		}
});


	server.listen(9300,function() {

		console.log('express seerver listening on port' + server.address());

});
