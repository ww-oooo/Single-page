const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '159357ww',
	database: 'qusetion'
})
module.exports = function() {
	var router = express.Router();
    //查询大标题数据
	router.get('/get_bigTitle', (req, res) => {
		db.query('SELECT * FROM title_table', (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
		db.query(`UPDATE title_table,que_table SET que_table.tid = title_table.ID WHERE que_table.title = title_table.title`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
		
	});
	//删除每一条数据
	
	router.get('/del_bigTitle',(req,res)=>{
		
		db.query(`DELETE FROM title_table WHERE ID='${req.query.ID}'`,(err)=>{
			if(err) {
				console.error(err)
			}
		})
	})
	//查询具体每一条数据的标题
		
	router.get('/get_aaa', (req, res) => {
		
          
		db.query(`SELECT * FROM title_table WHERE ID='${req.query.ID}'`, (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_answerPeo', (req, res) => {
		db.query(`SELECT name FROM answer_table WHERE tID='${req.query.ID}'`, (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_answer', (req, res) => {
		console.log(req.query.name)
		db.query(`SELECT ancontent FROM answer_table WHERE name='${req.query.name}'`, (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data[0].ancontent.split("&")).end();
			}
		})
	});
	router.get('/get_quest', (req, res) => {
		console.log(req.query.id)
		db.query(`SELECT quename FROM que_table WHERE tid='${req.query.id}'`, (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_bbb', (req, res) => {
		
          
		db.query(`SELECT * FROM que_table WHERE tid='${req.query.ID}'`, (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_nobook', (req, res) => {
		db.query('SELECT * FROM book_table WHERE status like "2"', (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/get_arbook', (req, res) => {
		db.query('SELECT * FROM book_table WHERE status like "3"', (err, data) => {
			if(err) {
				res.status(500).send('数据库错误').end();
			} else {
				res.send(data).end();
			}
		})
	});
	router.get('/send_answer',(req,res) =>{
		db.query(`INSERT INTO answer_table (tID,name,ancontent,ischeckdate) VALUE (
					'${req.query.tID}',
					'${req.query.name}',
					'${req.query.ancontent}',
					'${req.query.ischeckdate}'
					)`,
					(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		)			
	})
	router.get('/send_bigTitle', (req, res) => {
		 var question=req.query.qsItem.question;
           
		db.query(`INSERT INTO title_table (title) VALUE ('${req.query.bigTitle}')`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
		
		for(var j=0;j<question.length;j++){
			if(question[j].options){
				db.query(`INSERT INTO que_table (quename,type,quecontent,title) VALUE (
					'${question[j].title}',
					'${question[j].type}',
					'${question[j].options.join("&")}',
					'${req.query.bigTitle}'
					)`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
			}else{
					db.query(`INSERT INTO que_table (quename,type,title) VALUE ('${question[j].title}','${question[j].type}','${req.query.bigTitle}')`,
			(err, data) => {
				if(err) {
					console.error(err);
					res.status(500).send('database error').end();
				}
			}
		);
			}
           
           }
		
          		

		
	})
	router.get('/upa_nobook', (req, res) => {
		db.query(`UPDATE book_table SET  status='${req.query.status}' WHERE ID=${req.query.id}`,
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