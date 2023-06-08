const jwt=require('jsonwebtoken');
const AppError=require('../helpers/AppError');
const User=require('../models/user.js');



const verfiy_token=async function(req, res, next) {
    const token=req.headers.authorization;
    if(!token) return next(new AppError('please provide a token'))
    const id=jwt.verify(token,process.env.JWT_Seceret).id;
    const user=await User.findById(id);
    if(!user) return next(new AppError('user not found'));
    req.authorizedUser=user;
    req.id=id;
    next();
};

module.exports={verfiy_token};
