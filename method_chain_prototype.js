
if(! (typeof Function.prototype.method === "function")){ 
	Function.prototype.method=function(name,fn){
		this.prototype[name]=fn; 
		return this
	}
}
var Computer=function(value){
	this.value=value 
}.method("init",function(){
	this.value++;
	return this;
}).method("add",function(value){
	this.value+=value;
	return this;
}).method("getValue",function(){
	console.log(this.value)
})

new Computer(1).init().add(6).getValue()