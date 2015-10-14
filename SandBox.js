// (function(window,undefined){
// 	function SandBox(){ 
// 		var args=Array.prototype.slice.call(arguments);
// 		var callback=args.pop();
// 		var modules=(args[0] && typeof args[0] === "string")?args:args[0];
// 		var modLen=0;

// 		if(! this instanceof SandBox){ 
// 			return new SandBox(modules,callback);
// 		}
// 		if(modules.length === 0 || modules[0] === "*"){ 
// 			modules=[];
			// for(var mod in SandBox.modules){
			// 	if(SandBox.modules.hasOwnProperty(mod)){ 
			// 		modules.push(mod);
			// 	} 
			// }
// 		}
// 		modLen=modules.length;
// 		for(var i=0;i<modLen;i++){                                           
// 			SandBox.modules[modules[i]](this)
// 		}
// 		callback(this);

// 	} 
// 	return SandBox;
// }(window))





var SandBox=(function(window,undefined){
	function SandBox(){ 
		var args=Array.prototype.slice.call(arguments);
		var callback=args.pop();
		var modules=(args[0] && typeof args[0] === "string")?args:args[0];
		var modLen=0;

		if(! this instanceof SandBox){ 
			return new SandBox(modules,callback);
		}
		if(modules.length === 0 || modules[0] === "*"){ 
			modules=SandBox.modules;
		}
		modLen=modules.length;
		for(var i=0;i<modLen;i++){                                           
			SandBox.modules[modules[i]](this)
		}
		callback(this);

	} 
	return SandBox;
}())
SandBox.modules={ 
	dom:function(box){
		box.getElement=function(){ console.log("dd")};
		box.getStyle=function(){}
	},
	array:function(box){
		box.forEach=function(){} 
	}
}

SandBox(["array","dom"],function(box){ 
	box.getElement();

});