const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
     {
          username : {
               type:String, 
               trim: true,
               unique: true,
               required: {true: 'Enter your username'}
          },
          password : {
               type:String,
               required: {true: 'Enter your password'}
          }
     },
     {timestamps: true, versionKey:false}
)

userSchema.pre('save', async function save(next){
     try{
         if (!this.isModified('password')) return next();
     
         // Hash password    
         const salt = await bcryptjs.genSalt(10);
         const hashedPassword = await bcryptjs.hash(this.password, salt);
         this.password = hashedPassword;
         next();
 
     }catch(error){
         return next(error)
     }
 })


const User = mongoose.model('User', userSchema)

module.exports = User