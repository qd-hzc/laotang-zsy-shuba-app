/*!
 * =====================================================
 * User:HZC
 * State:RPC
 * =====================================================
 */

var rpc = new APIClient('/rpc');

/**
 * 登录
 * @param {Object} userName
 * @param {Object} password
 * @param {Object} callback
 */
function login(userName, password, callback) {
	rpc.login(userName, password, callback);
}

/**
 * 注册
 * @param {Object} userName
 * @param {Object} password
 * @param {Object} callback
 */
function register(userName, password, callback) {
	rpc.register(userName, password, callback);
}

/**
 * 查询删除的书
 * @param {Object} callback
 */
function listDelPdfId(callback) {
	rpc.listDelPdfId(callback);
}

/**
 * 返回分类下所有书
 * @param {Object} categoryId
 * @param {Object} callback
 */
function listPdf(categoryId, callback) {
	rpc.listPdfByPid(categoryId, callback);
}