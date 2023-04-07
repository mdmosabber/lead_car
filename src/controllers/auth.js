const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errorMiddleware = require('../middleware/errorMiddleware');






//Generate Token
const generateToken = (id, name)=> {
    return jwt.sign({id,name},process.env.JWT_SECRET, {expiresIn: '7d'});
}

//Set Cookie
const setCookie = (res,token)=> {
    res.cookie('token', token, {
        path: '/',
        // secure: true,
        expires: new Date(Date.now() + 7 * 1000 * 86400), // 7 day
        httpOnly: true,
        sameSite: "none",
    })
}

//Test
exports.index = (req, res)=> {
    res.send('<h2>Welcome To My Portfolio Application</h2>');
}


// Register
exports.register = async(req, res)=> {
    try{      
            
        const {username, password} = req.body;

        if(!username.trim() || !password.trim() ){
            res.status(400);
            throw new Error('Please fill up all require fields');
        }

        if(password.length < 6){
            res.status(400);
            throw new Error('Password must be up to 6 characters')
        }


        //new user create
        const user = await new User({
            username, password
        }).save();

        // token function calling;
        const token = generateToken(user._id, user.username);

        // set cookie
        setCookie(res, token);

        if(user){
            res.status(201).json(user)
        }else{
            res.status(400);
            throw new Error("Invalid user data");    
        }

    }
    catch(error){    
        errorMiddleware(error, req, res)
    }

}


//User Login
exports.login = async(req,res)=> {
    try{
        const {username, password} = req.body;

        if(!username, !password){
            res.status(400);
            throw new Error('Please add username and password');
        }

        //user exists
        const user = await User.findOne({username});

        if(!user){
            res.status(400);
            throw new Error('User not found please register')
        }

        //Password check 
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        // token function calling;
        const token = generateToken(user._id, user.username);

        // set cookie
        setCookie(res, token);

        if(user && passwordIsCorrect){
            res.status(200).json({
                data: user,
                success: true,
                message: "Login successfully",
            });
        }else{
            res.status(400);
            throw new Error('Invalid email or password');
        }

    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Logout
exports.logOut = (req,res)=> {
    try{
        // remove cookie
        setCookie(res, "");
        res.status(200).json({message: 'Logged Out Successfully'})
    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


// View Profile
exports.viewProfile = async(req, res)=> {
    try{
        
        const user = await User.findById(req.auth.id).select('-password');
        if (user) {           
            res.status(200).json(user);
        } 
        else {
            res.status(400);
            throw new Error("User Not Found");
        }
        
    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


//update profile
exports.updateProfile = async(req, res)=> {
    try{
        const user = await User.findById(req.auth.id);

        if(user){
            const {name, email, password, mobile} = user;
    
            user.name = req.body.name || name;
            user.email = req.body.email || email;
            user.password = req.body.password || password;
            user.mobile = req.body.mobile || mobile;
                       
            const userUpdate = await user.save();
            res.status(200).json(userUpdate);
        }else{
            res.status(400);
            throw new Error('User Not Found');
        }

    }catch(error){    
        errorMiddleware(error, req, res)
    }
}