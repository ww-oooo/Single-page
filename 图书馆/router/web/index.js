const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '159357ww',
	database: 'ohhlibrary'
})
module.exports = function() {
	var router = express.Router();

	router.get('/get_book', (req, res) => {
		db.query('SELECT * FROM book_table WHERE status like "ok"', (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_nobook', (req, res) => {
		db.query('SELECT * FROM book_table WHERE status like "nok"', (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	
	router.get('/upa_book', (req, res) => {
		db.query(`UPDATE book_table SET  status='${req.query.status}',borrowPeople='${req.query.borrowPeople}',borrowT='${req.query.borrowT}',backT='${req.query.backT}' WHERE ID=${req.query.id}`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
	})
	router.get('/upa_nobook', (req, res) => {
		db.query(`UPDATE book_table SET  status='${req.query.status}',borrowPeople='${req.query.borrowPeople}',borrowT='${req.query.borrowT}',backT='${req.query.backT}' WHERE ID=${req.query.id}`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
	})

	return router;
}