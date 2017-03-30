const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '159357ww',
	database: 'ohhlibrary'
});

const pathLib = require('path');
const fs = require('fs');

module.exports = function() {
	var router = express.Router();

	router.get('/', function(req, res) {
		switch(req.query.act) {
			case 'del':
				db.query(`SELECT * FROM book_table WHERE ID=${req.query.id}`, (err, data) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else {
						if(data.length == 0) {
							res.status(404).send('no this book evaluation').end();
						} else {
							fs.unlink('static/upload/' + data[0].src, (err) => {
								if(err) {
									console.error(err);
									res.status(500).send('file opration error').end();
								} else {
									db.query(`DELETE FROM book_table WHERE ID=${req.query.id}`, (err, data) => {
										if(err) {
											console.error(err);
											res.status(500).send('database error').end();
										} else {
											res.redirect('/admin/banners');
										}
									});
								}
							});
						}
					}
				});
				break;
			case 'mod':
				db.query(`SELECT * FROM book_table WHERE ID=${req.query.id}`, (err, data) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else if(data.length == 0) {
						res.status(404).send('no this evaluation').end();
					} else {
						db.query(`SELECT * FROM book_table`, (err, banners) => {
							if(err) {
								console.error(err);
								req.status(500).send('database error').end();
							} else {
								res.render('admin/banners.ejs', {
									banners,
									mod_data: data[0]
								});
							}
						});
					}
				});
				break;
			default:
				db.query(`SELECT * FROM book_table`, (err, banners) => {
					if(err) {
						console.error(err);
						req.status(500).send('database error').end();
					} else {
						res.render('admin/banners.ejs', {
							banners
						});
					}
				});
		}
	});
	router.post('/', function(req, res) {
		var name = req.body.name;
		var author = req.body.author;
		var instroduce = req.body.instroduce;

		if(req.files[0]) {
			var ext = pathLib.parse(req.files[0].originalname).ext;

			var oldPath = req.files[0].path;
			var newPath = req.files[0].path + ext;

			var newFileName = req.files[0].filename + ext;
		} else {
			var newFileName = null;
		}

		if(newFileName) {
			fs.rename(oldPath, newPath, (err) => {
				if(err) {
					console.error(err);
					res.status(500).send('file opration error').end();
				} else {
					if(req.body.mod_id) { //修改
						//先删除老的
						db.query(`SELECT * FROM book_table WHERE ID=${req.body.mod_id}`, (err, data) => {
							if(err) {
								console.error(err);
								res.status(500).send('database error').end();
							} else if(data.length == 0) {
								res.status(404).send('old file not found').end();
							} else {
								fs.unlink('static/upload/' + data[0].src, (err) => {
									if(err) {
										console.error(err);
										res.status(500).send('file opration error').end();
									} else {
										db.query(`UPDATE book_table SET \
                      name='${req.body.name}',\
                      author='${req.body.author}',\
                      instroduce='${req.body.instroduce}', \
                      src='${newFileName}' \
                      WHERE ID=${req.body.mod_id}`, (err) => {
											if(err) {
												console.error(err);
												res.status(500).send('database error').end();
											} else {
												res.redirect('/admin/banners');
											}
										});
									}
								});
							}
						});
					} else { //添加
						db.query(`INSERT INTO book_table (name, author, instroduce,status,src) VALUE('${name}', '${author}', '${instroduce}','ok','${newFileName}')`, (err, data) => {
							if(err) {
								console.error(err);
								res.status(500).send('database error').end();
							} else {
								res.redirect('/admin/banners');
							}
						});
					}
				}
			});
		} else {
			if(req.body.mod_id) { //修改
				//直接改
				db.query(`UPDATE book_table SET \
          name='${req.body.name}',\
          author='${req.body.author}',\
          instroduce='${req.body.instroduce}'
          WHERE ID=${req.body.mod_id}`, (err) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else {
						res.redirect('/admin/banners');
					}
				});
			} else { //添加
				db.query(`INSERT INTO book_table \
        (name, author, instroduce,status,src)
        VALUES('${name}', '${author}', '${instroduce}','ok','${newFileName}'`, (err, data) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else {
						res.redirect('/admin/banners');
					}
				});
			}
		}
	});

	return router;
};