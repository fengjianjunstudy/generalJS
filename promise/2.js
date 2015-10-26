function sum(n){ 
	return new Promise(function(resolve,reject){ 
		console.log("input: "+(n+n));
		setTimeout(function(){ 
			resolve(n+n)
		},1000)
	})
}
function multiply(n){ 
	return new Promise(function(res,rej){ 
		console.log("input: "+(n*n))
		setTimeout(function(){
			res(n*n)
		},1000)
	})
}
var p=new Promise(function(resolve,reject){ 
	console.log("begin");
	resolve(1)
});
p.then(sum).then(multiply).then(multiply).then(sum);