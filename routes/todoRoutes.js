const express = require('express')
const AppError=require('../helpers/AppError');
const router = express()
const Todo=require('../models/todo.js');
const jwt=require('jsonwebtoken');
const {verfiy_token} = require('../controllers/verify_token');


router.get('/',verfiy_token,async (req,res,next)=>{
    const todos=await Todo.find();
    if(!todos) return next(new AppError('todo lists not found',404));
    res.send({todos});
})

router.get('/:id',async (req,res,next)=>{
    try
    {
        const id=req.params.id;
        const todo=await Todo.findById(id);
        res.send(todo);
    }
    catch
    {
        next(new AppError('todo list not found',404));
    }
})
 
router.post('/',verfiy_token,async (req,res,next)=>{
    const { title,status }=req.body;
    console.log(title,status);
    if(!title || !status) return next(new AppError('please to do list title or status not entered',404))
    const date_Added=new Date();
    const todo=new Todo({title,status,date_Added,user:req.user.id});
    await todo.save();
    // const user=req.user;
    const todos=await Todo.find({user:req.user.id});
    res.send(todos);
})
 
router.post('/login',verfiy_token,async (req,res,next)=>
{
    const todos=await Todo.find({user:req.user.id});
    if(!todos) return next(new AppError('this user doesn have any todos'));
    res.send(todos);
})

router.delete('/',async (req,res,next)=>{
    const {title}=req.body;
    if(!title) return next(new AppError('todo list not found',404))
    await Todo.findOneAndDelete({title});
    const todos=await Todo.find();
    res.send(todos);
})

router.delete('/:id',async (req,res,next)=>{
    const id=req.params.id;
    try
    {
        const todo=await Todo.findById(id);
    }
    catch
    {
        next(new AppError('todo list not found',404));
    }
    await Todo.findByIdAndDelete(id);
    const todos=await Todo.find();
    res.send(todos);
});

router.patch('/',async (req,res,next)=>{
    const {title,status}=req.body;
    if(!title || !status) return next(new AppError('please to do list title or status not entered',404))
    const todo=await Todo.findOneAndUpdate({ title }, { $set: { status } },{ new: true });
    res.send(todo);
    // const todoObject=todo.toObject()
});

router.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports=router;
