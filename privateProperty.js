var PrivatePro=(function(){ 
	var count=0;
	var PrivatePro=function(){ 
	}
	PrivatePro.prototype.a=function(){ 
		console.log(++count)
	}
	return PrivatePro;
}());
var a1=new PrivatePro();
a1.a();
var a2=new PrivatePro();
a2.a();
var a3=new PrivatePro();
a3.a();
