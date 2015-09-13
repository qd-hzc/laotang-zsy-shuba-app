/*!
 * =====================================================
 * User:HZC
 * State:服务
 * 
 * 
 *  获取所有课程 courseCode课程,sReuslt为回调方法名
 * 
	function queryAllCourse(length, callback) {
		sDb.transaction(function(tx) {
			var sql = "select id,code,name,status,progress from category where length(code)=?";
			tx.executeSql(sql, [length], function(tx, rs) {
				var myRows = [];
				if (rs.rows.length > 0) {
					for (var i = 0; i < rs.rows.length; i++) {
						var row = rs.rows.item(i);
						myRows.push({
							code: row.code,
						});
					}
				}
				callback(myRows);
			}, onError);
		});
	}
	
 * =====================================================
 */
var sDb = openDatabase('bookStoreDb', '', 'bookStore Db', 5 * 1000 * 1000);

/**
 * 错误信息
 * @param {Object} tx
 * @param {Object} error
 */
function onError(tx, error) {
	mui.toast('The db operation mistake : HzcError -- ' + error.message);
	console.error('The db operation mistake : HzcError -- ' + error.message);
}

/**
 * 正确信息
 * @param {Object} tx
 * @param {Object} rs
 */
function onSucc(tx, rs) {
		console.log("onSuccess操作成功");
	}
	/**
	 * 获取
	 * @param {Object} categoryId
	 */

function getBooksByCategoryId(categoryId, callback) {
		sDb.transaction(function(tx) {
			var sql = "select id,name,img_path,html_name,dic_category_id,json,desc,is_download from dic_book where status = 1  and dic_category_id = ?";
			tx.executeSql(sql, [categoryId], function(tx, rs) {
				var myRows = [];
				if (rs.rows.length > 0) {
					for (var i = 0; i < rs.rows.length; i++) {
						var row = rs.rows.item(i);
						myRows.push({
							id: row.id,
							name: row.name,
							imgPath: row.img_path,
							htmlName: row.html_name,
							dicCategoryId: row.dic_category_id,
							jsonList: row.json,
							desc: row.desc,
							isDownload: row.is_download
						});
					}
				}
				callback(myRows);
			}, onError);
		});
	}
	/**
	 * 获取我的书
	 * @param {Object} start：开始数
	 * @param {Object} callback
	 */

function getMyBooks(start, callback) {
	sDb.transaction(function(tx) {
		var sql = "select id,name,img_path,html_name,dic_category_id,json,desc,is_download from dic_book where status = 1 limit ?,5";
		tx.executeSql(sql, [start], function(tx, rs) {
			var myRows = [];
			if (rs.rows.length > 0) {
				for (var i = 0; i < rs.rows.length; i++) {
					var row = rs.rows.item(i);
					myRows.push({
						id: row.id,
						name: row.name,
						imgPath: row.img_path,
						htmlName: row.html_name,
						dicCategoryId: row.dic_category_id,
						jsonList: row.json,
						desc: row.desc,
						isDownload: row.is_download
					});
				}
			}
			callback(myRows);
		}, onError);
	});
}

/**
 * 同步后台数据库中的books
 * @param {Object} data
 * @param {Object} callback
 */
function synDicBook(data, callback) {
	if (data.length > 0) {
		getLastBook(function(lastBook) {
			if (!lastBook) {
				lastBook.id = -1;
			}
			for (var i = 0; i < data.length; i++) {
				var book = data[i];
				if (book.id != lastBook.id) {
					saveBook(book, function() {
						console.log('保存书成功。');
					});
				}
			}
		});
	}
}

/**
 * 保存书
 * @param {Object} book
 * @param {Object} callback
 */
function saveBook(book, callback) {
	sDb.transaction(function(tx) {
		var sql = "insert into dic_book (id,name,img_path,html_name,dic_category_id,json,desc,status) values (?,?,?,?,?,?,?,?)";
		tx.executeSql(sql, [book.id, book.name, book.imgPath, book.htmlName, book.dicCategoryId, book.jsonList, book.desc, book.status],
			callback, function(tx, error){
				var msg =error.message.toString();
				if(msg.indexOf('unique')>0){
					updateBookStatus(book.id,1,callback);
				}
			});
	});
}


/**
 * 获取最后一本书的id
 * @param {Object} callback
 */
function getLastBook(callback) {
	sDb.transaction(function(tx) {
		var sql = 'select id from dic_book order by id desc limit 0,1';
		tx.executeSql(sql, [start], function(tx, rs) {
			var myRows = {};
			if (rs.rows.length > 0) {
				myRows.id = rs.rows[0].id;
			}
			callback(myRows);
		}, onError)
	});
}

/**
 * 更新书下载状态
 * @param {Object} bookId ：id
 * @param {Object} status :1：已下载，2：未下载
 * @param {Object} callback
 */
function updateDownloadStatus(bookId, status, callback) {
	sDb.transaction(function(tx) {
		var sql = 'update dic_book set is_download = ? where id = ?';
		tx.executeSql(sql, [status, bookId], function(tx, rs) {
			callback('true');
		}, onError);
	});
}

/**
 * 把所有已经下载的书的id保存在localstorage中
 * @param {Object} callback
 */
function saveBookIds(callback) {
	sDb.transaction(function(tx) {
		var sql = 'select id from dic_book where status = 1';
		tx.executeSql(sql, [], function(tx, rs) {
//			console.log(JSON.stringify(rs.rows));
			if (rs.rows.length > 0) {
				var ids = '';
				for (var i = 0; i < rs.rows.length; i++) {
					var bookId = rs.rows.item(i).id;
					ids = bookId + ',' + ids;
				}
//				console.log(ids);
				saveBookIdsInStorage(ids);
			}
			callback;
		}, onError);
	});
}

/**
 * 更新书的状态
 * @param {Object} id
 * @param {Object} status ： 0：不可用，1：可用
 */
function updateBookStatus(id, status,callback) {
	sDb.transaction(function(tx) {
		var sql = 'update dic_book set status = ? where id = ?';
		tx.executeSql(sql, [status, id], callback, onError)
	})
}