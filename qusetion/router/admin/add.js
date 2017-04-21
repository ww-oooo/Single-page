const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '159357ww',
	database: 'qusetion'
});
module.exports = function() {
	var router = express.Router();
}