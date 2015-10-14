/**
	应用场景：调用同一个函数，传递的参数绝大多数相同 ，那么这个函数就很适合做为参数传递给通用的函数转换函数（curryFn） 
*/


function curryFn(){
	var slice=Array.prototype.slice; 
	var args=slice.call(arguments);
	var fn=args.shift();
	return function(){ 
		var arg=args.concat(slice.call(arguments));
		return fn.apply(null,arg);
	}
}

function add(a,b,c,d){
	return a+b+c+d;
}

var add1=curryFn(add,1);
var sum=add1(2,3,6);
var sum1=add1(10,20,30)
console.log("sum"+sum)

console.log("sum1 "+sum1)