var express = require(express);
var app = express();
var router = express.Router();
var GPIO = require('onoff').Gpio; 
var motor_control = new GPIO(18, 'out');
var logger = require('morgan');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false }));
app.use(logger('dev'));


router.get('/water/{:onoff}/{:minute}', function(req, res, next){
	
		var onoff = request.params.onoff;
		var minute = request.params.minute;
		var time = minute*60*1000;

		if(onoff==1)
		{
			
			motor.writeSync(1); //motor on
			
			res.json( { 'result' : '1'});

		}

		else 
			next(); 

} , function(){



});
