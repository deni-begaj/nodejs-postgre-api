var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Todo = require('../models/todo');

router.use(bodyParser.json({limit: '2mb'}));

/* GET tofos page. */
router.route('/')
	.get(function(req, res, next){
		Todo.find({})
		.exec(function(err, todo){
			if(err) throw err;
			res.json(todo);
		});
	})
	.post(function(req, res, next){
		Todo.create(req.body, function(err, todo){
			if(err) throw  err;
			console.log('Todo Created!');
			var id = todo._id;
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Added the todo with id: ' + id);
		});
	})
	.delete(function(req, res, next){
		Todo.remove({}, function(err, resp){
			if(err) throw err;
			res.json(resp);
		});
});

router.route('/:todoId')
	.get(function(req, res, next){
		Todo.findById(req.params.todoId)
		.exec(function(err, todo){
			if(err) throw err;
			res.json(todo);
		});
	})
	.put(function(req, res, next){
		Todo.findByIdAndUpdate(req.params.todoId, {
			$set: req.body
		}, {new: true}, function(err, todo){
			if(err) throw err;
			res.json(todo);
		});
	})
	.delete(function(req, res, next){
		Todo.findByIdAndRemove(req.params.todoId, function (err, resp) {
      if (err) throw err;
		        res.json(resp);
	    });
});


module.exports = router;

