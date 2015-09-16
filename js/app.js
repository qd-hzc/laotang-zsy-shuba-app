/*!
 * =====================================================
 * User:HZC
 * State:公用方法
 * =====================================================
 */

//所有下载文件存放目录
var DOWNLOADPATH = '_downloads/';


(function($) {
	//全局配置(通常所有页面引用该配置，特殊页面使用mui.init({})来覆盖全局配置)
	$.initGlobal({
		swipeBack: false
	});
	var back = $.back;
	$.back = function() {
		var current = plus.webview.currentWebview();
		if (current.mType === 'main') { //模板主页面
			current.hide('auto');
			setTimeout(function() {
				document.getElementById("title").className = 'mui-title mui-fadeout';
				current.children()[0].hide("none");
			}, 200);
		} else if (current.mType === 'sub') {
			if ($.targets._popover) {
				$($.targets._popover).popover('hide');
			} else {
				current.parent().evalJS('mui&&mui.back();');
			}
		} else {
			back();
		}
	}
})(mui);

/**
 * toggle
 */
window.addEventListener('toggle', function(event) {
	if (event.target.id === 'M_Toggle') {
		var isActive = event.detail.isActive;
		var table = document.querySelector('.mui-table-view');
		var card = document.querySelector('.mui-card');
		if (isActive) {
			card.appendChild(table);
			card.style.display = '';
		} else {
			var content = document.querySelector('.mui-content');
			content.insertBefore(table, card);
			card.style.display = 'none';
		}
	}
});

/**
 * 生成HTML模板
 * @param {Object} templateStr ：模板
 * @param {Object} data
 */
function render(templateStr, data) {
		return templateStr.replace(/\{([\w\.]*)\}/g, function(str, key) {
			var keys = key.split("."),
				v = data[keys.shift()];
			for (var i = 0, l = keys.length; i < l; i++)
				v = v[keys[i]];
			return (typeof v !== "undefined" && v !== null) ? v : "";
		});
	}
	/**
	 * 根据id查找元素
	 * @param {Object} id
	 */

function $id(id) {
		return document.getElementById(id);
	}
	/**
	 * 判断用户是否登录，已经登录执行succeFunc，未登录执行 failedFunc
	 * @param {Object} successFunc
	 * @param {Object} failedFunc
	 */

function checkLoginStatus(successFunc, failedFunc) {
	var isAlreadyLogin = window.localStorage.getItem('______isAlreadyLogin_____');
	if (isAlreadyLogin == "true") {
		successFunc();
	} else {
		failedFunc();
	}
}

/**
 * 设置用户登录状态
 * @param {Object} msg ：true，false
 */
function setLoginStatus(msg) {
	window.localStorage.setItem('______isAlreadyLogin_____', msg);
}

/**
 * 检查当前网络连接状态
 * 当前设备网络连接状态未知、未连接网络，提示网络异常，请检查，同时返回false
 */

function toastNetworkInfo(msg) {
	var b = true;
	var network = plus.networkinfo.getCurrentType();
	if (network == 1 || network == 0) {
		if (msg) {
			mui.toast(msg);
		}
		b = false;
	}
	return b;
}

/**
 * 获取 app 版本
 */
function getAppVersion() {
	return window.localStorage.getItem("__appVersion");
}

/**
 * 设置app版本
 */
function setAppVersion() {
	var appVersion = plus.runtime.version;
	window.localStorage.setItem("__appVersion", appVersion);
}

/**
 * 检查是否是刚更新
 */
function checkIsUpdate() {
	var appVersion = getAppVersion();
	var nowVersion = plus.runtime.version;
	return (appVersion && appVersion == nowVersion) ? false : true;
}

/**
 * 检查是否是新安装
 */
function checkIsInstall() {
	var appVersion = getAppVersion();
	return appVersion ? false : true;
}


/**
 * 转换相对路径为绝对路径
 * @param {Object} relativePath
 */
function convertToAbsoluteURL(relativePath) {
	return plus.io.convertLocalFileSystemURL(relativePath);
}

/**
 * 删除指定文件
 * @param {Object} relativePath:相对路径
 */

function delFile(relativePath) {
	plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
		entry.remove(function(entry) {
			console.log("文件删除成功==" + relativePath);
		}, function(e) {
			console.log("文件删除失败=" + relativePath);
		});
	});
}

/**
 * 下载
 */
function downloadSource(loadUrl, succCallback, errCallback) {
	var dtask = plus.downloader.createDownload(loadUrl, {}, function(d, status) {
		if (status == 200) {
			//下载成功
//			console.log('下载成功:"_downloads/"' + d.filename);
			succCallback(d.filename);
		} else {
			//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
//			console.log('下载失败:"_downloads/"' + d.filename);
			//dtask.abort();//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
			errCallback();
		}
	});
	//启动下载任务
	dtask.start();
}

/**
 * <img>设置图片
 *1.从本地获取,如果本地存在,则直接设置图片
 *2.如果本地不存在则联网下载,缓存到本地,再设置图片
 * @param {Object} imgId
 * @param {Object} loadUrl
 */
function setImg(imgId, loadUrl) {
		if (imgId == null || loadUrl == null) return;
		//图片下载成功 默认保存在本地相对路径的"_downloads"文件夹里面, 如"_downloads/logo.jpg"
		var filename = loadUrl.substring(loadUrl.lastIndexOf("/") + 1, loadUrl.length);
		var relativePath = "_downloads/" + filename;
		//检查图片是否已存在
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			console.log("图片存在,直接设置=" + relativePath);
			//如果文件存在,则直接设置本地图片
			setImgFromLocal(imgId, relativePath);
		}, function(e) {
			console.log("图片不存在,联网下载=" + relativePath);
			//如果文件不存在,联网下载图片
			setImgFromNet(imgId, loadUrl, relativePath);
		});
	}
	/**
	 * 给图片标签<img>设置本地图片
	 * imgId 图片标签<img>的id
	 * relativePath 本地相对路径 例如:"_downloads/logo.jpg"
	 * @param {Object} imgId
	 * @param {Object} relativePath
	 */

function setImgFromLocal(imgId, relativePath) {
		//本地相对路径("_downloads/logo.jpg")转成SD卡绝对路径("/storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/logo.jpg");
		var sd_path = plus.io.convertLocalFileSystemURL(relativePath);
		//给<img>设置图片
		$id(imgId).setAttribute("src", sd_path);
	}
	/**
	 * 联网下载图片,并设置给<img>
	 * @param {Object} imgId
	 * @param {Object} loadUrl
	 * @param {Object} relativePath
	 */

function setImgFromNet(imgId, loadUrl, relativePath) {
	//先设置下载中的默认图片
	var defalutImgPath = convertToAbsoluteURL('_www/images/common/pull_fresh.png');
	$id(imgId).setAttribute("src", defalutImgPath);
	//创建下载任务
	var dtask = plus.downloader.createDownload(loadUrl, {}, function(d, status) {
		if (status == 200) {
			//下载成功
			console.log("下载成功=" + relativePath);
			setImgFromLocal(imgId, d.filename);
		} else {
			//下载失败,需删除本地临时文件,否则下次进来时会检查到图片已存在
			console.log("下载失败=" + status + "==" + relativePath);
			//dtask.abort();//文档描述:取消下载,删除临时文件;(但经测试临时文件没有删除,故使用delFile()方法删除);
			if (relativePath != null)
				delFile(relativePath);
		}
	});
	//启动下载任务
	var ll = dtask.start();
}

/**
 * 设置下载图片
 * @param {Object} imgId
 */
function setDownloadImage(imgId) {
	var defalutImgPath = convertToAbsoluteURL('_www/images/common/pull_fresh.png');
	$id(imgId).setAttribute("src", defalutImgPath);
}

/**
 * 把所有已经下载的书的id保存在localstorage中
 * @param {Object} ids
 */
function saveBookIdsInStorage(ids){
	window.localStorage.setItem('bookIds____',ids);
}

function getBookIdsFromStorage(){
	return window.localStorage.getItem('bookIds____');
}

/**
 * 去除字符前后空格 
 * @param {Object} str
 */
function hzcTrim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

/**
 * 保存用户id 
 * @param {Object} userId
 */
function saveUserId(userId){
	window.localStorage.setItem('__userId__',userId);
}

/**
 * 返回用户id 
 */
function getUserId(){
	return window.localStorage.getItem('__userId__');
}

