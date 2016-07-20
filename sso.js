(function(win) {
var AppScope = win.AppScope = AppScope || {};
//对话框 html 模板
var tpl = '<div id="new_login_layer" style="position: fixed;z-index: 90000;"><h3 id="login_layer_close_wrap">弹框标题</h3><a id="login_layer_close" href="javascript:;" class="close_btn jj_layerout_close">X</a><div class="content"><div class="layer_left"><ul id="dialog_logintab_wrap" class="loginTab clearfix"><li cid="dx">短信快捷登录</li><li cid="u" class="active">账号密码登录</li></ul><div id="dialog-mobile-login" class="loginBox mobileLogin"><ul class="itemList"><li><div class="itemBox"><input class="mobile" type="text" placeholder="请输入手机号码"> <i class="error"></i></div><em class="mobileError error_msg"></em></li><li class="imgCheck"><div class="clearfix"><div class="itemBox yzmbox"><input class="yzm_mobile" type="text" placeholder="验证码"> <i class="error"></i></div><a href="javascript:;"><img id="dialog_checkyzm" class="yzm_num" alt="imgCodeLoading" src=""></a></div><em class="yzm_mobileError error_msg"></em></li><li><div class="clearfix"><div class="itemBox yzmbox"><input class="dtyzm" type="text" placeholder="动态密码"> <i class="error"></i></div><a class="dtyzm_num" href="javascript:;">获取动态密码</a> <a class="dtyzm_num again none" href="javascript:;">重新发送 58</a></div><em class="dtyzmError error_msg"></em></li></ul><a class="submit_btn" href="javascript:;">登 录</a></div><div id="dialog-user-login" class="loginBox userLogin" style="display:block"><ul class="itemList"><li><div class="itemBox"><input class="user" type="text" placeholder="请输入手机号码或邮箱"> <i class="error"></i></div><em class="userError error_msg"></em></li><li><div class="itemBox"><input class="password" type="password" placeholder="请输入登录密码"> <i class="error"></i></div><em class="passwordError error_msg"></em></li><li class="imgCheck yzmuserbox"><div class="clearfix"><div class="itemBox yzmbox"><input class="yzm_user" type="text" placeholder="验证码"> <i class="error error_msg"></i></div><a href="javascript:;"><img id="dialog_checkyzm2" alt="imgCodeLoading" class="yzm_num" src=""></a></div><em class="yzm_userError"></em></li></ul><div class="tips clearfix"><span class="autoLogin"><input type="checkbox" checked>下次自动登录</span> <span class="forget"><a target="_blank" href="">忘记密码？</a></span></div><a class="submit_btn" href="javascript:;">登 录</a></div></div><div class="layer_right"><div class="otherLogin"><span>合作账号登录</span><div><a class="weibo" href="javascript:;"></a> <a class="weixin" href="javascript:;"></a></div><a class="register" target="_blank" href="">免费注册</a></div><div class="remind_msg"><span class="icon">公告</span><p>tttttttttttttttttttt</p></div></div></div></div>';

var utl = {
    $ : function ( id ) {
        return document.getElementById(id);
    },
    _extend: function(destination, source, inScore) {
        for (var property in source) {
            if( source.hasOwnProperty(property) ){
                //限制扩展 指定函数名可以扩展
                if (inScore && inScore.toString().indexOf(property) < 0 ) continue;
                destination[property] = source[property];
            }
        }
        return destination;
    },
    showLog:true,//日志开关
    log :function (m){
        utl.showLog&&window.console&&console.log&&console.log(m);
    },
　　addHandler : function(ele, type, handler){
        if (!ele) return false;
　　　　if (ele.addEventListener) {
　　　　　　ele.addEventListener(type, handler, false);
　　　　} else  if ( ele.attachEvent) {
　　　　　　ele.attachEvent('on' +type, handler);
　　　　} else {
　　　　　　ele['on' +type] =  handler;
　　　　}
　　},
　　removeHandler : function (ele, type, handler) {
        if (!ele) return false;
　　　　if (ele.removeEventListener) {
　　　　　　ele.removeEventListener(type, handler, false);
　　　　} else if (ele.detachEvent) {
　　　　　　ele.detachEvent('on'+type, handler);
　　　　}else {
　　　　　　ele['on'+type]=null;
　　　　}
　　},
    /**
    * @method setCookie
    * @desc 设置cookie
    * @param {string} name - cookie名
    * @param {string} value - cookie值
    * @param {string} days - cookie有效时间
    * @param {string} domain - cookie有效域名
    */
    setCookie : function(name, value, days, domain){
       if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }else{
            var expires = "";
        }
        var cstr = name + "=" + value + expires + "; path=/" + (domain ? "; domain=" + domain : "");
        document.cookie = cstr;
    },
    /**
    * @method getCookie
    * @desc 获取cookie
    * @param {string} name - cookie名
    */
    getCookie : function(name){
      var t = document.cookie.match(new RegExp("\\b" + name + "=([^;]+)"));
            return t ? t[1] : ""
    },
    loadJsFile : function(path, callback) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", path);
        var done = false;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                callback && callback();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    },

    //计算弹出框的位置
    dialogPosition : function(dialog ) {
      var dem = document.documentElement;
      return {wh:dem.clientHeight,top: Math.max((dem.clientHeight - dialog.height) / 2, 0), left: Math.max((dem.clientWidth - dialog.width) / 2, 0)};
    }

};

var App = function App(config) { this.init.apply(this, arguments);};

  App.prototype = {
    constructor:App,
    init: function ( config ){
        var that = this;
        this.ssoLoginConfig = config;
        //这里应该是 sso.js 第三方登录JS 接口
        /*var src = "sso.js";
        utl.loadJsFile(src, function () {
            that.bindEvents();
        });*/ 

        that.bindEvents();
    },
    _initSsoLogin: function () {
        if(ljLogin && typeof ljLogin == 'function') {
            this.ssoInstanceof = new ljLogin( this.ssoLoginConfig );
        } else {
            throw ' "ssoLogin.js" not loaded';
        }
    },
    //扩展方法入口
    extend: function(obj) {
        obj = obj || {};
        utl._extend( this, obj, ['beforeOpenDialog','beforeCloseDialog','afterCloseDialog','successCall','isLogin'] );
    },

    isLogin: function () {

    },
    //页面扩展实现 可选择
    beforeOpenDialog: null,
    beforeCloseDialog:null,
    afterCloseDialog: null,
    successCall: null,
    /*启动 登录对话框有两种方式
    * 1：页面设置 按钮 id = open_login_layer_btn,  自动绑定触发事件
    * 2：页面 不设置 id = open_login_layer_btn 按钮， 页面控制 逻辑 调用  openDialog();
    * 例如：调用方式： AppScope.App.getInstanceof().openDialog.call( AppScope.App.getInstanceof() );
    */
    openDialog: function () {
        this.closeDialog();
        this.beforeOpenDialog && this.beforeOpenDialog();
        var pos = utl.dialogPosition( {height:430, width:622} );
        var div = document.createElement('div'),
            mask = document.createElement('div');//蒙层
            mask.setAttribute('class','dialog-mask');
            mask.id = 'dialog_login_mask_id';
            mask.style.height = pos.wh+'px';

            div.innerHTML = tpl;
            div.id = 'new_login_layer_wrap';
        var dialog = document.createDocumentFragment();
            dialog.appendChild(div);
        var bd = document.getElementsByTagName("body")[0];
            bd.appendChild( dialog );
            bd.appendChild( mask );

        this.setDialogPos();
        //this._initSsoLogin();
        this.bindDialogEvents();
    },

    //关闭对话框 并销毁
    closeDialog: function closeDialog() {
        var layerId = utl.$('new_login_layer_wrap'),
            maskId = utl.$('dialog_login_mask_id');
        if (!layerId) { return false;}
        this.beforeCloseDialog && this.beforeCloseDialog();
        this.unbindDialogEvents();
        layerId.style.display ='none';
        maskId.style.display ='none';
        layerId.parentNode.removeChild(layerId);
        maskId.parentNode.removeChild(maskId);

        this.afterCloseDialog && this.afterCloseDialog();
    },
    //设置弹出框位置
    setDialogPos: function setDialogPos() {
        var dialog = utl.$('new_login_layer'),
            maskId = utl.$('dialog_login_mask_id'),
            pos = utl.dialogPosition( {height:430, width:622} );

            maskId.style.height = pos.wh+'px';
            dialog.style.top =pos.top+'px';
            dialog.style.left=pos.left+'px';
    },
    //切换图片验证码
    checkyzm: function (e) {
        e.preventDefault&&e.preventDefault();
        e = e || window.event;
        var target = e.target || e.srcElement;
        var ele = target.nodeName;
        if ( ele.toLowerCase() == 'img') {
            //图片验证码地址
            target.setAttribute("src", "imgsrc?" + Math.random());
        }
       return false;
    },
    //手机号 与 账号登录 切换
    formTab: function (e) {
        e.preventDefault&&e.preventDefault();
        e = e || window.event;
        var target = e.target || e.srcElement;
        var ele = target.nodeName;
        if ( ele.toLowerCase() == 'li') {
            var lis = target.parentNode.childNodes,
                mobile = utl.$('dialog-mobile-login'),
                user = utl.$('dialog-user-login');
                lis[0].className = '';
                lis[1].className = '';
            target.className = 'active';

            if(target.getAttribute('cid') == 'dx'){
                mobile.style.display = 'block';
                user.style.display = 'none';
            } else {
                mobile.style.display = 'none';
                user.style.display = 'block';
            }
        }
        return false;
    },

    removePlaceholder: function(e) {
        e.preventDefault&&e.preventDefault();
        e = e || window.event;
        var ele = e.target || e.srcElement;
        var lb = ele.parentNode.getElementsByTagName('label')[0];
            lb&&ele.parentNode.removeChild( lb );
        return false;
    },

    addPlaceholder: function(e) {
        e.preventDefault&&e.preventDefault();
        e = e || window.event;
        var ele = e.target || e.srcElement;
        var val = ele.getAttribute('value');
        //有输入值 不需要添加提示了
        if (val && val.length > 0) { return false; }
        var v = ele.getAttribute('pld');
        var lb = ele.parentNode.getElementsByTagName('label')[0];
        var lb = document.createElement('label');
            lb.className = 'placeholder';
            lb.innerHTML = v;
        ele.parentNode.appendChild( lb );

        return false;
    },

    //页面 登录按钮 绑定弹窗事件
    bindEvents: function () {
        var that = this, body = document.getElementsByTagName('body')[0];
            utl.addHandler(body, 'click', function (e) {
                e = e || window.event;
                var ele = e.target || e.srcElement;
                utl.log('open-id:'+ ele.id);
                // 如果页面有 ID 打开对话框 从这里开始
                if (ele.id == 'open_login_layer_btn') {
                    that.openDialog();
                }
            } );
    },

    //绑定对话框 的 事件
    bindDialogEvents: function () {
        var that = this;
        //关闭对话框
        utl.addHandler(utl.$('login_layer_close'), 'click',  function(){that.closeDialog(); } );
        //监听 窗口 改变大小事件 
        utl.addHandler(win, 'resize', that.setDialogPos );
        // 图片验证码 点击更新图片
        utl.addHandler(utl.$('dialog_checkyzm'), 'click', that.checkyzm );
        utl.addHandler(utl.$('dialog_checkyzm2'), 'click', that.checkyzm );
        //点击 切换 登录方式 短信/用户名 登录
        utl.addHandler(utl.$('dialog_logintab_wrap'), 'click', that.formTab );

        this.inputHandler();// 添加输入框 事件

    },

    //添加输入框 事件
    inputHandler: function ( b ) {
        //如果IE 执行 
        utl.log( navigator.userAgent );
        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
            utl.log('you browser is IE');
            var that = this;
            var inputs = utl.$('new_login_layer_wrap').getElementsByTagName('input');

            for (var i=0,p,v; i<inputs.length; i++) {
                p = inputs && inputs[i] || null;
                if (!b) {//添加 输入框得到焦点事件
                    v = (p&&p.getAttribute('placeholder')) || null;
                    if (v != null) {
                        var lb = document.createElement('label');
                            lb.className = 'placeholder';
                            lb.innerHTML = v;
                        p.parentNode.appendChild( lb );
                        p.setAttribute('pld',v);
                        p.removeAttribute('placeholder');

                        utl.addHandler(p, 'focus', that.removePlaceholder );
                        //utl.addHandler(p, 'click', that.removePlaceholder );
                        utl.addHandler(p, 'blur', that.addPlaceholder );
                    }
                } else {//移除输入框焦点事件
                        utl.removeHandler(p, 'focus', that.removePlaceholder );
                        utl.removeHandler(p, 'blur', that.addPlaceholder );
                }
            }
        }
    },

    //解绑 对话框事件
    unbindDialogEvents: function () {
        var that = this;
        utl.removeHandler(utl.$('login_layer_close'), 'click',  that.closeDialog );

        utl.removeHandler(win, 'resize',  that.setDialogPos );

        utl.removeHandler(utl.$('dialog_checkyzm'), 'click', that.checkyzm );
        utl.removeHandler(utl.$('dialog_checkyzm2'), 'click', that.checkyzm );

        utl.removeHandler(utl.$('dialog_logintab_wrap'), 'click', that.formTab );

        this.inputHandler(1);//如果传入 true 就是移除事件

    }

};

//单一实例化
App.getInstanceof = function ( config ) {
    utl.log('getInstanceof');
    if (!App._instaceof) {
        utl.log('getInstanceof-new():'+config );
        if (config) {
            App._instaceof = new App( config );
        } else {
            throw 'ssoLogin config is mustbe';
        }
    }
    return App._instaceof;
}

AppScope.App = App;

 var loginConfig = { };

//window.onload = function () {
    AppScope.App.getInstanceof( loginConfig );
//};

})(window);