
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    short_desc: {
        type: String,
        required: false
    },
    long_desc: {
        type: String,
        required: false
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    assign_user: {
        type: String,
        required: false
    },
    working_hours: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});



var Todo = mongoose.model('Todo', todoSchema);


module.exports = Todo;