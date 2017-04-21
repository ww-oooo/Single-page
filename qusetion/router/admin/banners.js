const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '159357ww',
	database: 'qusetion'
});

const pathLib = require('path');
const fs = require('fs');

module.exports = function() {
	var router = express.Router();

	router.get('/', function(req, res) {
		switch(req.query.act) {
			
			
			
			   
			
			case 'del':
				db.query(`SELECT * FROM title_table WHERE ID=${req.query.id}`, (err, data) => {
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
									db.query(`DELETE FROM title_table WHERE ID=${req.query.id}`, (err, data) => {
										if(err) {
											console.error(err);
											res.status(500).send('database error').end();
										} else {
											res.redirect('/admin');
										}
									});
								}
							});
						}
					}
				});
				break;
			case 'mod':
				db.query(`SELECT * FROM title_table WHERE ID=${req.query.id}`, (err, data) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else if(data.length == 0) {
						res.status(404).send('no this evaluation').end();
					} else {
						db.query(`SELECT * FROM title_table`, (err, banners) => {
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
				db.query(`SELECT * FROM title_table`, (err, banners) => {
					if(err) {
						console.error(err);
						res.status(500).send('database error').end();
					} else {
						res.render('admin/banners.ejs', {
							banners
						});
					}
				});
		}
	});
	
	return router;
};