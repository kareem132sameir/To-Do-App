const Todo=require('../models/todo.js');
const AppError=require('../helpers/AppError');


const getTodos=async (req,res,next)=>{
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
}

const getTodosById=async (req,res,next)=>{
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
}

const createTodos=async (req,res,next)=>{
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
}

const deleteTodos=async (req,res,next)=>{
    try
    {
        const todos=await Todo.find({userID:req.id});
        if(todos.length==0)return next(new AppError('your to do list is already empty'));
        await Todo.deleteMany({userID:req.id});
        res.send("to-do list deleted successfully");
    }
    catch(error)
    {
        return next(error);
    }
}

const deleteTodosById=async (req,res,next)=>{
    const id=req.params.id;
    try
    {
        const todo=await Todo.findById(id);
        if(!todo)return next(new AppError('this to do no longer exists'));
        if(todo.userID==req.id)
        {
            await Todo.findByIdAndDelete(id);
            const todos=await Todo.find({userID:req.id});
            res.send({message:"to do was deleted successfully",todos});
        }
        else
        {
            res.send("you can't delete other users to do");
        }
    }
    catch(error)
    {
        next(error);
    }
}

const updateTodoById=async (req,res,next)=>{
    try
    {
        const id=req.params.id;
        const {title,status}=req.body;
        if(!title || !status) return next(new AppError('please to do list title or status not entered',404))
        const todo=await Todo.findById(id);
        if(!todo)return next(new AppError('this to do no longer exists'));
        if(todo.userID==req.id)
        {
            const updatedtodo=await Todo.findOneAndUpdate({ _id:id }, { $set: { status,title} },{ new: true });
            res.send({message:"to do was updated successfully",updatedtodo});
        }
        else
        {
            res.send("you can't edit other users to do");
        }
    }
    catch(error)
    {
        next(error);
    }
}

module.exports={getTodos,getTodosById,createTodos,deleteTodos,deleteTodosById,updateTodoById}