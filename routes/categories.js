var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var CategoryClient = require('../data/categories');

router.use(bodyParser.json({limit: '2mb'}));

router.route('/')
	.get(function(req, res, next){

		CategoryClient.getAll(req, res)
		.then(data => {
			res.json(data);
		}).catch(ex => {
			res.json({
				responseDescription: "Internal Server Error",
				responseStatus: 500,
				errorMessage: ex.message
			})
		});

	})
	.post(function(req, res, next){

		CategoryClient.createNew(req, res)
		.then(data => {
			res.json(data)
		}).catch(ex => {
			res.json({
				responseDescription: "Internal Server Error",
				responseStatus: 500,
				errorMessage: ex.message
			})
		});

	});

router.route('/:'+CategoryClient.paramName)
	.all(function(req, res, next)
	{
		var id = req.params[CategoryClient.paramName];
		if(isNaN(id)) {
			res.json([]);
		} else {
			next();
		}
	});

router.route('/:'+CategoryClient.paramName)
	.get(function(req, res, next){
		CategoryClient.getSingle(req, res)
		.then(data => {
			res.json(data)
		}).catch(ex => {
			res.json({
				responseDescription: "Internal Server Error",
				responseStatus: 500,
				errorMessage: ex.message
			})
		});
	})
	.put(function(req, res, next){
		CategoryClient.updateObject(req, res)
		.then(data => {
			res.json(data)
		}).catch(ex => {
			res.json({
				responseDescription: "Internal Server Error",
				responseStatus: 500,
				errorMessage: ex.message
			})
		});		
	})
	.delete(function(req, res, next){
		CategoryClient.deleteSingle(req)
		.then(data => {
			res.json(data)
		}).catch(ex => {
			res.json({
				responseDescription: "Internal Server Error",
				responseStatus: 500,
				errorMessage: ex.message
			})
		});		
	});


module.exports = router;