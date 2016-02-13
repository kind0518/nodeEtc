var express = require('express');
var app = express(); //app은 express 서버의 객체.
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
 
//핵심 모듈선언

var spawn = require('child_process').spawn;
/*

	child_process 모듈은 무엇인가?

	Node.js 애플리케이션에서 서버의 다중 프로세서를 효율적으로 활용하려면 작업을 자식 프로세스에게 분배해야한다.
	child_process 모듈을 사용해 자식 프로세스를 생성하거나 다른 프로세스의 작업을 실행 할 수 있다.
*/
var proc;
//전역 변수로써, spawn을 사용햇을 때, child_process객체의 반환을 받기위한 변수이다.
 
app.use('/', express.static(path.join(__dirname, 'stream')));
//app.use는 서버에 미들웨어 적용할때 사.모듈내의 있는 메소드(미들웨어)사용시 쓴다.
//마운드 경로지정 (가상경로지정) : express.static함수를 통해 제공되는 파일에 대한 가상 경로 접두부가 실제로 존재하지 않는 경우는 첫번째 인자에 가상경로를 지정해주어야한다.
//가상경로를 통해 접근시에, 2번째인자 stream 디렉토리에 포함된 파일을 로드 할 수 있다.
//static미들웨어는 정적자산을 제공시에 사용한다.
//express.static('폴더명')은 상대경로로 자원을 제공
//express.static(__dirname,'폴더명') 절대경로로 자원을 제공.
/*

익스프레스는 미들웨어 스택으로 구성되어있다.
당신이 미들웨어를 사용하기 위해서는, app.use를 이용하여 당신이 원하는 미들웨어를 추가할 수 있다.
그리고, express의 미들웨어 스택에 추가가된다. ㅁ0
0*/
 
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
//기본 경로로 index.html을 선언.
 
var sockets = {}; //소켓의 동적 배열.선언.연결된 소켓정보가 넣어진다.
 

io.on('connection', function(socket) { //socket.io에서 커넥션 이벤트가 발생시에.소켓 create 정보 저장 및 출
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length); //Object.keys는뭐지?
  console.log("connection socket id : " + socket.id);
  console.log("socket {} value : " + sockets);
//Object.key는 간단하게 말하자면, 자기 자신의 인자값을 반환한다고 보면된다.
//예를 들어서. 배열이라고 햇을 때, [3,100,2] 라는 값을 Object.keys 에넣어서 반환값을 보면, 0,1,2라는 인자값만 출력된다.
//객체형태도 마찬가지이다. name : value 구성의 갯수의 인자값만 나온다.
//즉 위의 lenghth로 길이를 가져오는 것이다. 현재 소켓의 갯수와같이.

 
/*

	Object.keys 함수.


*/
  socket.on('disconnect', function() {//socket.io에서 disconnect발생시, 소켓 전역변수에서 삭제. 
  console.log("Disconnection socket id : "+socket.id);

   delete sockets[socket.id];

 
    // no more sockets, kill the stream 자식프로세스를 종료시킨다. 더이상 찍을필요가없다. 유저가 접속하지 않았으니까.
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    
    if (proc) proc.kill(); //자식프로세스 일 경우에, 자식프로세스를 종료시킨다. 이는 raspistill의 종료를 의미하기도한다.

    fs.unwatchFile('./stream/image_stream.jpg');
  }
}
 
function startStreaming(io) {
 
  console.log("start Streaming..");

  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    console.log("app.get in");
    return;
  }
 
  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args); 
//여기서 자식프로세스가 생성된다.
//자식프로세스는 촬영을 한다. proc은 spawn이 리턴한는 ChildProcess 객체를 얻게된다. 이 객체의 주요 메소드는 kill,send,disconnect()등이있다.
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true); //app.set이 머지.
  //아,파일이 변화햇을때 보내준다. true로 설정해서.

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })
 
}


