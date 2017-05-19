var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

/**
 *  ES6 syntax where the exported compnent name and attribute are the same;
 *   
 * module.exports = {
 *      mongoose: mongoose
 * };
 * 
 * could be elaborated as follows.
 */
module.exports = { mongoose };