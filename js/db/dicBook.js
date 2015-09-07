/*!
 * =====================================================
 * User:HZC
 * State:书表
 * 每次更新需要保留数据库操作历史。
 * =====================================================
 */
function createTableBook(tx) {
	tx.executeSql('DROP TABLE IF EXISTS dic_book', []);
	//id,name,img_path,pdf_path,html_dist,html_name,dic_category_id,json,desc,status(0:无效,1:有效),is_download(0：没有下载，1：已经下载)
	tx.executeSql('create table if not exists dic_book(id INTEGER PRIMARY KEY AUTOINCREMENT,name text,img_path text,pdf_path text,html_name text,dic_category_id INTEGER,json text,desc text,status INTEGER,is_download INTEGER)', [], function(tx, rs) {
		console.log("add message data");
	}, onError);
//	tx.executeSql('INSERT INTO dic_book values(?,?,?,?,?,?,?,?,?,?)', [1, '铁人---精神', 'logo.png','','',1,'','123456789',1,1]);
//	tx.executeSql('INSERT INTO dic_book values(?,?,?,?,?,?,?,?,?,?)', [2, '快速减肥', 'logo.png','','',1,'','123456789',1,1]);
//	tx.executeSql('INSERT INTO dic_book values(?,?,?,?,?,?,?,?,?,?)', [3, '文件', 'logo.png','','',1,'','123456789',1,0]);
}