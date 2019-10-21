(function($){
$.extend({
	socketRoom:function(options){
		var defaults = {//初始化参数
				url:'',
				userCode:'',
				callbak:null,
				errorCallBak:null
			};
		var setting = $.extend(defaults, options);
		//定义连接信息
		var SOCKET_LABLE = {
			ON_CONNECT:'connect',
			DIS_CONNECT:'disconnect',
			NOTICE_EVENT:'fullNoticeEvent',
			NOTICE_EVENT_ONE:'separateNoticeEvent',
			CHAT_EVENT:'chatEvent',
			ERROR_EVENT:'error',
			USER_LABLE:'userCode'
		};
		//定义异常信息
		var SOCKET_EXCEPTION = {
			NO_HOST:{code:'80001',describe:'setting url is null'},
			NO_USERCODE:{code:'80002',describe:'setting userCode is null'},
			NO_SEND_USER:{code:'80003',describe:'The message receiver is empty'},
			DIS_CONNECT:{code:'80004',describe:'connecting is fail'}
		};
		//空校验方法
		var paramIsNUll = function(param){
			if(param==null||param==''||param== undefined){
				return true;
			}
			return false;
		}
		var errorFunction = function(data){
			throw data;
		}
		var defaultCallbak = function(type,data){
			var title="";
			switch(type){
				case 0:
					title = "公告";
					break;
				case 1:
					title = "个人通知";
					break;
				case 2:
					title = "交谈消息";
					break;
				default:
					title = "警告";
					break;
			}
			
			alert(title+"\r\n"+data);
		}
		if(paramIsNUll(setting.url)){
			throw SOCKET_EXCEPTION.NO_HOST;
		}
		if(paramIsNUll(setting.userCode)){
			throw SOCKET_EXCEPTION.NO_USERCODE;
		}
		if(paramIsNUll(setting.callbak)){
			setting.callbak = defaultCallbak;
		}
		if(paramIsNUll(setting.errorCallBak)){
			setting.errorCallBak = errorFunction;
		}
		var url = setting.url+"?"+SOCKET_LABLE.USER_LABLE+"="+setting.userCode;
		var socket = io.connect(url);
		socket.on(SOCKET_LABLE.ON_CONNECT, function (data) {
			console.log(data);
		});
		socket.on(SOCKET_LABLE.DIS_CONNECT, function (data) {
			 setting.callbak(3,SOCKET_LABLE.DIS_CONNECT);
		 	throw SOCKET_EXCEPTION.DIS_CONNECT;
		});
		//监听公告推送消息
		socket.on(SOCKET_LABLE.NOTICE_EVENT,function(data){
		    setting.callbak(0,Base64.decode(data));
		}); 
		//监听个人推送消息
		socket.on(SOCKET_LABLE.NOTICE_EVENT_ONE,function(data){
			 setting.callbak(1,Base64.decode(data));
		});
		socket.on(SOCKET_LABLE.CHAT_EVENT,function(data){
			 setting.callbak(2,Base64.decode(data));
		});
		socket.on(SOCKET_LABLE.ERROR_EVENT,function(data){
			setting.errorCallBak(Base64.decode(data));
		});
		var sendMSg = function (toUser,data){
			if(paramIsNUll(toUser)){
				throw SOCKET_EXCEPTION.NO_SEND_USER;
			}
			var messageInfo = {userCode:toUser,msgContent:data};
			var msgStr = JSON.stringify(messageInfo);
			socket.emit(SOCKET_LABLE.CHAT_EVENT,Base64.encode(msgStr));
		};
		this.fn.send = sendMSg;
		var Base64 = {

			    // private property
			    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

			    // public method for encoding
			    encode: function(input) {
			        var output = "";
			        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			        var i = 0;

			        input = Base64._utf8_encode(input);

			        while (i < input.length) {

			            chr1 = input.charCodeAt(i++);
			            chr2 = input.charCodeAt(i++);
			            chr3 = input.charCodeAt(i++);

			            enc1 = chr1 >> 2;
			            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			            enc4 = chr3 & 63;

			            if (isNaN(chr2)) {
			                enc3 = enc4 = 64;
			            } else if (isNaN(chr3)) {
			                enc4 = 64;
			            }

			            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

			        }

			        return output;
			    },

			    // public method for decoding
			    decode: function(input) {
			        var output = "";
			        var chr1, chr2, chr3;
			        var enc1, enc2, enc3, enc4;
			        var i = 0;

			        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			        while (i < input.length) {

			            enc1 = this._keyStr.indexOf(input.charAt(i++));
			            enc2 = this._keyStr.indexOf(input.charAt(i++));
			            enc3 = this._keyStr.indexOf(input.charAt(i++));
			            enc4 = this._keyStr.indexOf(input.charAt(i++));

			            chr1 = (enc1 << 2) | (enc2 >> 4);
			            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			            chr3 = ((enc3 & 3) << 6) | enc4;

			            output = output + String.fromCharCode(chr1);

			            if (enc3 != 64) {
			                output = output + String.fromCharCode(chr2);
			            }
			            if (enc4 != 64) {
			                output = output + String.fromCharCode(chr3);
			            }

			        }

			        output = Base64._utf8_decode(output);

			        return output;

			    },

			    // private method for UTF-8 encoding
			    _utf8_encode: function(string) {
			        string = string.replace(/\r\n/g, "\n");
			        var utftext = "";

			        for (var n = 0; n < string.length; n++) {

			            var c = string.charCodeAt(n);

			            if (c < 128) {
			                utftext += String.fromCharCode(c);
			            } else if ((c > 127) && (c < 2048)) {
			                utftext += String.fromCharCode((c >> 6) | 192);
			                utftext += String.fromCharCode((c & 63) | 128);
			            } else {
			                utftext += String.fromCharCode((c >> 12) | 224);
			                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			                utftext += String.fromCharCode((c & 63) | 128);
			            }

			        }

			        return utftext;
			    },

			    // private method for UTF-8 decoding
			    _utf8_decode: function(utftext) {
			        var string = "";
			        var i = 0;
			        var c = c1 = c2 = 0;

			        while (i < utftext.length) {

			            c = utftext.charCodeAt(i);

			            if (c < 128) {
			                string += String.fromCharCode(c);
			                i++;
			            } else if ((c > 191) && (c < 224)) {
			                c2 = utftext.charCodeAt(i + 1);
			                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			                i += 2;
			            } else {
			                c2 = utftext.charCodeAt(i + 1);
			                c3 = utftext.charCodeAt(i + 2);
			                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			                i += 3;
			            }

			        }

			        return string;
			    }

			};
		//return sendMSg;
		return this(setting);
	}
});

})(jQuery)