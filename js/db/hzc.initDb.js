/*!
 * =====================================================
 * User:HZC
 * State:数据库
 * =====================================================
 */
var db = openDatabase('bookStoreDb', '', 'bookStore Db', 5 * 1000 * 1000);

mui.plusReady(createTable);

//添加数据
function createTable(onSuccess) {
	console.log("开始添加测试数据.....");
	db.transaction(function(tx) {
		//执行访问数据库的语句
		db.transaction(function(tx) {
			createTableCategory(tx);
		});
		db.transaction(function(tx){
			createTableBook(tx);
		})
	});
}

//sql语句执行成功后执行的回调函数

function onSuccess(tx, rs) {
		console.log("onSuccess操作成功");
	}
	//sql语句执行失败后执行的回调函数

function onError(tx, error) {
	console.log("操作失败，失败信息：" + error.message);
}

