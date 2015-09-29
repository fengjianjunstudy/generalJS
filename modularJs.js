//js  书写模块化
(function(window,undefined){ 
	var csdn=window.csdn=csdn?csdn:{};
	(function(fn){ 
		fn(csdn);
	})(function(exprots){ 
		exprots.mod1=exprots.mod1 === undefined ?{}:exprots.mod1;
		exprots.mod1.subMod=(function(op){
			console.log(op)
		})
		exprots.mod1.subMod1=(function(op){
			console.log(op)
		})
	})
})(window)

csdn.mod1.subMod({name:"xiaoming",age:18})
console.log(window)
console.log(csdn)