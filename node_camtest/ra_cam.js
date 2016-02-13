var http= require('http'),
	fs = require('fs'), //fs모듈은 파일 시스템으로써 파일을 읽고 쓰는 등의 행위를 할 수 있다.
	util = require('util');

http.createServer(function (req, res) {

	var path = 'video/video.mp4';
	var stat = fs.statSync(path);
	var total = stat.size;

	if ( req.headers['range']){

		console.log("if statement in");
		console.log(req.headers['range']);

		var range = req.headers.range;
		var parts = range.replace(/bytes=/,"").split("-");
		var partialstart =parts[0];
		var partialend=parts[1];

		var start = parseInt(partialstart, 10);
		var end = partialend ? parseInt(partialend, 10) : total-1;
		var chunksize = (end-start)+1;

		console.log('RANGE:' + start + '-' +end +'=' + chunksize);

		var file = fs.createReadStream(path, {start: start, end : end});
		
		res.writeHead(206, { 'Content-Range' : 'bytes' + start + '-' + end + '/' + total, 'Accept-Ranges': 'byres', 'content-Length' : chunksize, 'Conent-Type' : 'video/mp4'});
		file.pipe(res);
		}

	else {
		console.log('ALL : ' + total);
		res.writeHead(200, { 'Content-Length' : total, 'Content-type' : 'video/mp4'});
		fs.createReadStream(path).pipe(res);
			


	} 


}).listen(1337, '127.0.0.1');

console.log('server running at http://127.0.0.1 :1337');
