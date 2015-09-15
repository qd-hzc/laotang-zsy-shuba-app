/*!
 * =====================================================
 * User:HZC
 * State:路由配置对象
 * =====================================================
 */
(function(w) {
	var domain = 'http://192.168.2.132:3333/'; //production
	w.Routes = {
		domain: domain,
		urls: {
			// 用户相关
			user: {
				// 登录	
				login: domain + 'SysUserCtrl.loginForPufa.do',
				//注册
				register: domain + ''
			},
			//图书相关
			book: {
				//获取所有书
				getBooks: domain + '',
				//图书logo
				bookUrl: domain + '',
				//下载图书
				downloadBook: domain + ''
			}

		}
	};
})(window);

/**
 *	发送验证码
 * @param {Object} username 手机号
 * @param {Object} sendBtn 点击发送的按钮
 */

function sendCode(username, sendBtn, successFun) {
	if (username.length == 0) {
		mui.toast('请输入手机号码 ');
		return;
	}
	if (username.length != 11) {
		mui.toast('请输入有效的手机号码 ');
		return;
	}
	if (!myreg.test(username)) {
		mui.toast('请输入有效的手机号码 ');
		return;
	}
	var code = username + 'liu';
	username = strEnc(username, 'q', 'w', 'e');
	code = strEnc(code, '2', '3', '4');

	mui.ajax(Routes.urls.user.sendVerifyCode, {
		data: {
			username: username,
			code: code
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			mui.toast('验证码已发送 ');
			sendBtn.setAttribute('issend', 1);
			if (data && data.success) {
				var result = data.message;
				var _verifycode = result.substr(0, 6);
				successFun(_verifycode);
			} else {
				mui.toast(data.message);
			}
		},
		error: function() {
			mui.toast('网络异常');
			window.localStorage.setItem('isAlreadyLogin', false);

		}
	});
	//		successFun('111111');
}
var myreg = /^(13|14|15|18)\d{9}$/;

/**
 * 网络异常统一回调函数
 * @param {Object} xhr
 * @param {Object} type
 * @param {Object} errorThrown
 */
function networkErrorHandler(xhr, type, errorThrown) {
	var b = toastNetworkInfo();
	if (!b) {
		mui.toast("请先打开网络");
	} else {
		mui.toast("网络异常，请先设置网络");
	}
}