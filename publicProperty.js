function FnClass(){ 
	//console.log(this instanceof FnClass)
	if(!(this instanceof FnClass)){ 
		//console.log("ee")
		return new FnClass();
	}
}
FnClass.aa=function(){
	if(this instanceof FnClass){ 
		console.log("实例对象调用");
		return ;

	} 
	console.log("构造函数调用")
}
FnClass.prototype.aa=FnClass.aa;
FnClass.aa();
var aaa=FnClass();
console.log(aaa.aa());
