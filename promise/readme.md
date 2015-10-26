promise 

new Promise(function(resolve,reject){
	if(true){ //成功
		resolve(m)
	} else{ //失败
		reject(m)
	}
})


p.then(callback)
callback的参数和resolve中的一致
p.catch(callback)
callback的参数和reject中的一致

Promise最大的好处是在异步执行的流程中，把执行代码和处理结果的代码清晰地分离了
p.then(callback).then(callback).then(callback)
前一个then必须返回Promise对象后面的then才能用链式写法