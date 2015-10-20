var inherit=(function(){ 
	function F(){}
	return function(Parent,Child){ 
		F.prototype=Parent.prototype;
		var f=new F();
		Child.prototype=f;
	}
}());
function Parent(name){ 
	this.name=name || "xiaohua";
}
function Child(name){ 
	this.name=name;
}
function P(name){ 
	this.name=name || "xiaohei";
}
function C(name){ 
	this.name=name;
}
Parent.prototype.getName=function(){ 
	console.log("welcome "+this.name)
}
P.prototype.getName=function() { 
	console.log("hello "+this.name)
}
inherit(Parent,Child);
inherit(P,C);
var child=new Child("biaoge");

child.getName();
var c=new C("miaomiao");
c.getName()
