var express = require('express');
var path = require('path'); 
var logger = require('morgan');

var sensorLib = require("node-dht-sensor");  //온습도센서 모듈
var sen_tem; //온도 변수
var sen_hum; //습도 변수
//var water = require('./routes/water'); 


//var bodyParser = require('body-parser');
///외부서버 코딩.


//var water = ('./routes/water'); //워터 라우팅선언. 물스케줄관리.

var app = express(); //app create.

/////////////////////////////////////////////////////////////
var server = app.listen(3000, function() {

		console.log(' socket server run..');
});

var io = require('socket.io').listen(server);
//socket listen server create


////////////////////////////////////////////////////////////////




var sensor = { //sensor initiallize
			
		sensors: [ {
				name: "indoor",
				type: 11,
				pin: 4
		}],

		//센서 초기화. dht11 센서, input pin 4번


		read: function() {
				for (var a in this.sensors) {
					b = sensorLib.readSpec(this.sensors[a].type, this.sensors[a].pin);

					sen_tem=b.temperature.toFixed(1);
					sen_hum=b.humidity.toFixed(1) ;
				
				
					}
		
		}
		
};//온도 센서 읽어들임.


		io.sockets.on('connection', function(socket) {

			console.log("connection ..");
			


			socket.on('sendvalue',  function(data) {
				sensor.read();
				socket.emit('rec_tem',  sen_tem);
				socket.emit('rec_hum',sen_hum);

				console.log(data.result);
				console.log("rec_tem send.");

				console.log("rec_hum send");
				
			});

			



		});

//app.use('/water', water);  //water parse

app.get('/tem', function(req,res){
	
		sensor.read();
	

		res.json({
			
			"tem" : sen_tem,
			"hum" : sen_hum				
				
		})
			


});







app.get('/', function(req,res){

	res.sendfile('test.html', { root:__dirname});

	

});








// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//app.use('/water',water); //water 페이지 접속시, 워터로 넘겨준다




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
