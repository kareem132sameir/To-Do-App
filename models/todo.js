const mongoose=require('mongoose');
const { Schema } = mongoose;

const todoSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["done","wip","to-do"]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    date_Added:{
        type:Date,
        required:true
    }
});

const Todo=mongoose.model('Todo',todoSchema)
module.exports=Todo;