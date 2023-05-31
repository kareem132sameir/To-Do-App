const mongoose=require('mongoose');
const { Schema } = mongoose;
const bcrypt=require('bcrypt');

const userSchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        selected:false
    }
});

userSchema.methods.savePassword=async function(password)
{
    const hashedPassword=await bcrypt.hash(password,10);
    this.password=hashedPassword;
}

userSchema.methods.checkPassword=async function(password)
{
    const isMatch=await bcrypt.compare(password,this.password);
    return isMatch;
};

const User=mongoose.model('Users',userSchema)
module.exports=User;