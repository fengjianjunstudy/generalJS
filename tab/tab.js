/**
 * Created by fengjj on 2015/10/20.
 */
(function(window,$,undefined){
    /**
        @namespace  CsdnApi
    */
    var CsdnApi=window.CsdnApi || {};
    /*
        @class Csdn.Tab
        @function 选项卡
        @argument opt  Object  配置项
    * */
    CsdnApi.Tab=function(opt){
        /*
            @property  tab    String  必填 切换标签选择器
            @property  tabCon  String 必填 需要切换的容器选择器
            @property  curClass String 必填 当前样式
            @property  eventType String 可选 事件类型  默认为 click 事件
            @property  callBack  Function 可选 切换结束以后需要处理的程序
        * */
        if(!(this instanceof  CsdnApi.Tab)){
            return new CsdnApi.Tab(opt);
        }
        this.tab=opt.tab;
        this.tabCon=opt.tabCon;
        this.curClass=opt.curClass;
        this.eventType=opt.eventType || "click";
        this.callBack=opt.callBack;
        this.init();
    }
    CsdnApi.Tab.prototype={
        constructor:CsdnApi.Tab,
        init:function(){
            var oTab=document.querySelectorAll(this.tab),
                oTabCon=document.querySelectorAll(this.tabCon),
                nTabLen=oTab.length,
                self=this;
            for(var i=0;i<nTabLen;i++){
                (function(i){
                    oTab[i].addEventListener(self.eventType,function(){
                        self.handleFn(i)
                    },false)
                }(i))
            }

        },
        handleFn:function(index){
            var oTab=document.querySelectorAll(this.tab),
                oTabCon=document.querySelectorAll(this.tabCon),
                nTabLen=oTab.length,
                self=this;
            var reg = "/" + this.curClass + "[\\s|$]|\\s*" + this.curClass + "$/g";
            for(var i=0;i<nTabLen;i++){
                if(i === index){
                    oTab[i].className=oTab[i].className+" "+this.curClass;
                    oTabCon[i].style.display="block";
                }else{
                    oTab[i].className=oTab[i].className.replace(eval(reg),'');
                    oTabCon[i].style.display="none";
                }
            }
            if(typeof this.callBack === "function"){
                this.callBack(index);
            }
        }
    }

    /*
        @class UpDown
        @function 收起 展开
        @argument
    * */
    CsdnApi.UpDown=function(opt){
        if(!(this instanceof  CsdnApi.UpDown)){
            return new CsdnApi.UpDown(opt)
        }
        this.upDownBtn=opt.upDownBtn;
        this.showHideBox=opt.showHideBox;
        this.flag=opt.flag || true;
        this.callback=opt.callBack;

        this.init();
    }
    CsdnApi.UpDown.prototype={
        constructor:CsdnApi.UpDown,
        init:function(){
            var self=this;
            if(typeof this.callback === "function"){
                this.callback(this.upDownBtn,this.showHideBox)
            }else{
                //做最简单的操作
                $(this.upDownBtn).on("click",function(){
                    if(self.flag){
                        $(self.upDownBtn).html("展开")
                        $(self.showHideBox).slideUp();
                        self.flag=false;
                    }else{
                        $(self.upDownBtn).html("收起")
                        $(self.showHideBox).slideDown();
                        self.flag=true;
                    }
                })
            }
        }
    }
     return window.CsdnApi=CsdnApi;

}(window))