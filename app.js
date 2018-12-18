var express = require("express");
var bodyParser = require("body-parser");
var categoriesRouter = require("./routes/categories");
var app = express();
var config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/categories', categoriesRouter);

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
    console.log("Application running on port:", server.address().port);
});