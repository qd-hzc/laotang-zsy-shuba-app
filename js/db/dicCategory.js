/*!
 * =====================================================
 * User:HZC
 * State:分类表。
 * 每次更新需要保留数据库操作历史。
 * =====================================================
 */
function createTableCategory(tx) {
	tx.executeSql('DROP TABLE IF EXISTS dic_category', []);
	//id,name,img_path,status(0:无效,1:有效)
	tx.executeSql('create table if not exists dic_category(id INTEGER PRIMARY KEY AUTOINCREMENT,name text,img_path text,status INTEGER)', [], function(tx, rs) {
		console.log("add message data");
	}, onError);

	tx.executeSql('INSERT INTO dic_category values(?,?,?,?)', [1, '铁人精神', '', 1]);
	tx.executeSql('INSERT INTO dic_category values(?,?,?,?)', [2, '国学', '', 1]);
	tx.executeSql('INSERT INTO dic_category values(?,?,?,?)', [3, '励志', '', 1]);
	tx.executeSql('INSERT INTO dic_category values(?,?,?,?)', [4, '企业管理', '', 1]);
}
