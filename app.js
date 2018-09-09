var express = require("express");
var bodyParser = require("body-parser");
var todoRouter = require("./routes/todo.js");
var app = express();
var mongoose = require('mongoose');
var config = require('./config');

//connect to the MongoDB
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected correctly to server');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/todos', todoRouter);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});