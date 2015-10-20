var http=require("http");
http.createServer(function(req,res){
	// console.log(req)
	// res.writeHead(200,{"Content-Type":"text/plain"});
	// res.end("hello world") 
	var body=[];
	req.on("data",function(chunk){
		body.push(chunk)
	})

	req.on("end",function(){ 
		body=Buffer.concat(body);
		console.log(body.toString())
	})
}).listen(8000);