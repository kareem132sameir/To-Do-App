const express = require('express')
const router = express()
const jwt=require('jsonwebtoken');
const {verfiy_token} = require('../controllers/verify_token');
const {getTodos,getTodosById,createTodos,deleteTodos,deleteTodosById,updateTodoById} = require('../controllers/todoControllers');

router.get('/',getTodos);

router.get('/:id',getTodosById);
 
router.post('/',createTodos);
 
router.delete('/',deleteTodos);

router.delete('/:id',deleteTodosById);

router.patch('/:id',updateTodoById);

router.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

module.exports=router;
