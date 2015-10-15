function  Computer(value){
	this.value=value 
}
Computer.prototype.init=function(){ 
	this.value++;
	return this;
}
Computer.prototype.add=function(value){ 
	this.value+=value;
	return this;
}
Computer.prototype.getValue=function(){ 
	console.log(this.value)
}

new Computer(1).init().add(6).getValue()