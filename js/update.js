var server = "http://182.92.109.194:8001/appInstall/zsysb/update.json"; //获取升级描述文件服务器地址

/**
 * 自动验证，并更新app
 */
function update(from) {
	var osname = plus.os.name;
	var appid = plus.runtime.appid;
	/**
	 * 更新方法
	 * @param {Object} respDataStr
	 */

	function updateHandler(respDataStr) {
			var respData = eval('(' + respDataStr + ')');
			var data = respData[osname];
			var newVersion = parseInt(data.version.split('.').join(''));
			var version = parseInt(plus.runtime.version.split('.').join(''));
			if (newVersion <= version) {
				if (from == "inner")
					mui.toast('已是最新版本~');
				return;
			}
			plus.ui.confirm(data.note, function(i) {
				console.log(JSON.stringify(i))
				if (0 == i.index) { // 点击了: 立即更新
					plus.runtime.openURL(data.url);
				}
			}, data.title, ["立即更新", "取　　消"]);
		}
		//获取服务器的最新版本信息
	mui.ajax(server, {
		dataType: 'text', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		success: updateHandler,
		error: function(xhr, type, errorThrown) {
			//			console.log(errorThrown)
			//			console.log(JSON.stringify(xhr.responseText))
		}
	});

}


//mui.plusReady(update);