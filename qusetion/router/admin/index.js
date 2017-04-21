const express = require('express');

module.exports = function() {
	var router = express.Router();


	router.use('/', require('./banners')());

	return router;
};