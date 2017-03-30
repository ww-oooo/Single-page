const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '159357ww', database: 'ohhlibrary'});
const pathLib=require('path');
const fs=require('fs');
module.exports=function (){
  var router=express.Router();

  router.get('/', (req, res)=>{
  	
    switch(req.query.act){
      case 'mod':
        db.query(`SELECT * FROM book_table WHERE id=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else if(data.length==0){
            res.status(404).send('data not found').end();
          }else{
            db.query('SELECT * FROM book_table', (err, banners)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.render('admin/banners.ejs', {banners, mod_data: data[0]});
              }
            });
          }
        });
        break;
      case 'del':
        db.query(`DELETE FROM book_table WHERE ID=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/banners');
          }
        });
        break;
      default:
        db.query('SELECT * FROM book_table', (err, banners)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.render('admin/banners.ejs', {banners});
          }
        });
        break;
    }
  });
  router.post('/', (req, res)=>{
    var name=req.body.name;
    var author=req.body.author;
    var instroduce=req.body.instroduce;
     console.log(req.files);
    var ext=pathLib.parse(req.files[0].originalname).ext;
    var oldPath=req.files[0].path;
    var newPath=req.files[0].path+ext;
    var newFileName=req.files[0].filename+ext;
    fs.rename(oldPath,newPath,(err)=>{
    	if(err){
    		res.status(500).send('file err').end();
    	}else{
    		   if(!name || !author || !instroduce){
      res.status(400).send('arg error').end();
    }else{
      if(req.body.mod_id){    //修改
        db.query(`UPDATE book_table SET \
          name='${req.body.name}',\
          author='${req.body.author}',\
          instroduce='${req.body.instroduce}' \
          WHERE ID=${req.body.mod_id}`,
          (err, data)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/admin/banners');
            }
          }
        );
      }else{                  //添加
        db.query(`INSERT INTO book_table (name, author, instroduce,status,src) VALUE('${name}', '${author}', '${instroduce}','ok','${newFileName}')`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/banners');
          }
        });
      }
    }
    	}
    })
 
  });

  return router;
};
