/*
	@function adv tracking
	@editer fjj
	@create_time 20151201
**/
(function(widnow,$,undefined){
	function TrackAdv(){
		this.advs=[];  // 被载入广告位集合
		this.advFlag={};  //  用于载入广告位去重
		//this.expAdvs=[];
		this.init();
	}
	TrackAdv.prototype={
		constructor:"Track",
		init:function(){
			var self=this;
			$(widnow).on("scroll",function(){
				if(self.advs.length === 0){
					return false;
				}
				for(var i=0;i<self.advs.length;i++){
					
					if(self.posTest(self.advs[i]) && self.advs[i].view){
						self.advs[i].viewed=true;
						self.sendData(self.advs[i]);
						
					}

				}
			})
		},
		//载入广告对象
		addAdvs:function(eleStr,opt){
			var self=this,
				eleStr=eleStr || ".J_adv",
				opt=typeof opt === "object"?opt:{},
				oAdvs=$(eleStr),
				nAdvLen=oAdvs.length,
				curAdr=widnow.location.href,  //  当前地址
				preAdr=document.referrer || "-";   // 前一个文档地址
			if(nAdvLen === 0){
				return false;
			}
			for(var i=0;i<nAdvLen;i++){
				var adv={};
				var aid=$(oAdvs[i]).data("aid");
				if(this.advFlag[aid]){
					return false;
				}
				adv.ele=$(oAdvs[i]);
				adv.top=$(oAdvs[i]).offset().top;
				adv.height=$(oAdvs[i]).height();
				adv.view=typeof $(oAdvs[i]).data("view") === "undefined" ?true:$(oAdvs[i]).data("view");  //  对应广告位是否需要曝光
				adv.viewed=false;   //被曝光时为true
				adv.data={
					aId:$(oAdvs[i]).data("aid"),
					curAdr:curAdr,
					preAdr:preAdr,
					amod:opt.amod || adv.ele.data("amod") || 1,
					con:self.exportData(adv),
					ckCon:"-",
					uId:"-"
				};
				if(this.posTest(adv) && adv.view){
					adv.viewed=true;
					this.sendData(adv);
				}
				this.advs.push(adv);
				this.linkNodes(adv);
				//console.log(this.advs);
				//this.expAdvs.push(adv);
				this.advFlag[aid]=true;

			}

		},
		// 测试广告位是否在曝光区域
		posTest:function(adv){
			if(adv.viewed){
				return false;
			}
			var t1=$(document).scrollTop()-adv.height;
			t1=t1<=0?0:t1;
			var t2=$(document).scrollTop()+$(widnow).height();
			return !adv.viewed && adv.top>=t1 && adv.top<=t2;

		},
		// 获取广告位中所有的连接且添加click事件
		linkNodes:function(adv){
			var self=this;
			var aLinks=adv.ele.find("a");
			if(aLinks.length === 0){
				return false;
			}

			aLinks.each(function(){
				if($(this).attr("target") == undefined){
					$(this).attr("target","_blank");
				}

				$(this).on("click",function(){
					con=self.linkData(this);
					self.sendData(adv,con);
				})
			})
		},
		// 获取曝光内容即广告位中所有连接的内容
		exportData:function(adv){
			var eleLinks=adv.ele.find("a");
			var cons=eleLinks.map(function(){
						var con="";
						if($(this).find("img").length){
							con+=$(this).find("img").eq(0).attr("title") || $(this).find("img").eq(0).attr("alt")
						}else{

							con+=$(this).html();
						}
						con+=":";
						con+=$(this).attr("href");
						return con;
					}).get().join(";");
			return cons;
		},
		//获取点击元素的内容
		linkData:function(that){
			if($(that).find("img").length){
				return $(that).find("img").eq(0).attr("title") || $(that).find("img").eq(0).attr("alt")
			}else{
				return $(that).html();
			}

		},
		//获取用户ID
		getUserId:function(){
			var result=/(; )?(UserName|_javaeye_cookie_id_)=([^;]+)/.exec(widnow.document.cookie);
			var uid= (result != null ? result[3] : void 0) || '-';
			return uid;
		},
		//提交数据
		sendData:function(adv,con){
			adv.data.uId=this.getUserId();
			if(typeof con === "string"){
				adv.data.ckCon=con;
			}
			protocol="http:";
			var img =new Image();
			img.onload=img.onerror=function(){
				img.onload=img.onerror=null;
				img=null;
			}
			var dataStr=this.paramData(adv.data);
			img.src=protocol+"//dc.csdn.net/re?"+dataStr;
		},
		//转换为字符串
		paramData:function(data){
			var dataArr=[];
			for(var key in data){
				var text=key+"="+data[key];
				text.replace(/^\s+|\s+$/g,"");
				dataArr.push(text);
			}
			return dataArr.join("&")
		}
	}
	widnow.CSDN=widnow.CSDN?widnow.CSDN:{};
	return window.CSDN.track=new TrackAdv();
})(window,jQuery)