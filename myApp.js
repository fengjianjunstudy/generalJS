/**
	@module myApp
*/
(function(window,undefined){
	var myApp={};
	/**
		@namespace myApp
		@class math_stuff	
	*/
	myApp.math_stuff={
		/**
			@method sum
			@param {Number} 第一个数字
			@param {Number} 第二个数字
			@return {Number} 总和
		*/
		sum:function(first,second){ 
			return first+second;
		},
		multi:function(first,second){ 
		}
	}
	/**
		@namespace myApp
		@constructor
		@class Person
		@param {String} 名字
		@param {Number}  年龄

	*/
	myApp.Person=function(name,age){ 
		/**
			@property p_name
			@type String
		*/
		this.p_name=name;
		this.p_age=age;
	}

	/**
		@namespace findNodes
		@param {String}  标签名称
		@param {Function} option 回调函数  
		@return {Array}  node节点数组
	*/
	myApp.findNodes=function(tagName,callback){ 
		var nodes=[],
			allNodes=document.getElementsByTagName(tagName),
			allLen=allNodes.length,
			i=0,
			hasCallBack=false;
		if(typeof callback === "function"){ 
			hasCallBack=true;
		}
		for(;i<allLen;i++){ 
			
			var backFlag=hasCallBack?callback(allNodes[i]):undefined;
			if(typeof backFlag === "undefined"){ 
				nodes.push(allNodes[i])
			}else if(backFlag){ 
				nodes.push(allNodes[i])
			}else{ 
				continue;
			}
		}
		return nodes;
	}
	return window.myApp=myApp;
}(window));