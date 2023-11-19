const mongoose = require('mongoose')
module.exports.init = async function(){
await mongoose.connect('mongodb+srv://Taskdb:gBsXq608KBR0KtDd@cluster0.15xns4l.mongodb.net/TodoData?retryWrites=true&w=majority')
}