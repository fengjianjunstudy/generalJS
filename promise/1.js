function test(resolve,reject){ 
	var timeout=Math.random()*2;
	setTimeout(function(){ 
		if(timeout<1){ 
			resolve(timeout);
		}else{ 
			reject(timeout)
		}
	},1000)
}
console.log("hello 1")
var p=new Promise(test);
console.log("hello 2")
p.then(function(s){ 
	console.log("小于1 "+s);
}).catch(function(s){ 
	console.log("大于1 "+s);
})
console.log("hello 3")