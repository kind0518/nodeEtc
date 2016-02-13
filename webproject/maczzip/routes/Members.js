var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var body_parser = require('body-parser');
var router= express.Router();

var path = require('path');

var connection=mysql.createConnection({
//db connection 
	host:'127.0.0.1',
	port:3306,
	user:'root',
	password: 'pi0518',
	database:'mac' 
});


router.get('/',function(request,response,next){


		response.json({ //json model 
				"member_id" :"0"

		})
	
});



router.get('/:userid/:password',function(request,response,next){


	var userid=request.params.userid;
	var password=request.params.password;
	console.log('get :/userid, passwordin');
	console.log(userid);
	console.log(password);

	connection.query('select ID,PW from MEMBERS where ID=? and PW=?;',[userid,password],function(error, info)
	{
		if(error != undefined){//this error code
		console.log('undefined');
			response.sendStatus(503); //error code print

		}

		else if(info.length==0){ //no ID AND PW

			console.log('no ID AND PW');
			response.json({ //json model 
				"member_id" :"0",
				'member_point':'0'

		})
	
	
		}

		else //table same  ID AND PW . retunr ID and point value.

			connection.query('select ID,Member_point from MEMBERS where ID=?;',userid,function(error,cursor){

					if(error!=undefined){
					
						console.log("select Id,member error");
						response.sendStatus(503);

					}

					else
					{	console.log('id and member_point return.');
						response.json(cursor);

					}
	
			});//END Connection.query statement member_point.


	}); //end connection.query ID .PW	

		
		
});

module.exports=router;




