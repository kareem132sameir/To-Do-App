const express = require('express')
const AppError=require('../helpers/AppError');
const router = express()
const Todo=require('../models/todo.js');
const jwt=require('jsonwebtoken');
const {verfiy_token} = require('../controllers/verify_token');


router.get('/',async (req,res,next)=>{
    try
    {
        const todos=await Todo.find({userID:req.id});
        if(todos.length==0) return next(new AppError('todo lists is empty',404));
        res.send({todos});
    }
    catch(error)
    {
        return next(error);
    }
})

router.get('/:id',async (req,res,next)=>{
    try
    {
        const userID=req.id;
        const id=req.params.id;
        const todo=await Todo.findById(id);
        if(todo.userID==userID)
        {
            res.send(todo);
        }
        else
        {
            res.send('you do not have access to these to-dos');
        }
    }
    catch
    {
        next(new AppError('todo list not found',404));
    }
})
 
router.post('/',async (req,res,next)=>{
    try
    {
        const { title,status }=req.body;
        if(!title || !status) return next(new AppError('to do list title or status not entered',404))
        const date_Added=new Date();
        const todo=new Todo({title,status,date_Added,userID:req.id});
        await todo.save();
        const todos=await Todo.find({userID:req.id});
        res.send(todos);
    }
    catch(error)
    {
        return next(error)
    }
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
