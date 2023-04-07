const {readdirSync} = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const MongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorMiddleware = require('./src/middleware/errorMiddleware');
mongoose.set('strictQuery', true);

const app = express();

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 300, 
	standardHeaders: true, 
	legacyHeaders: false, 
})


//Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(MongoSanitize());
app.use(cookieParser());
app.use(limiter);


//Router middleware
readdirSync('./src/routes').map((routeFile) =>  app.use('/api/v1', require(`./src/routes/${routeFile}`)));


//404 error handle
app.use((req,res, next)=> {
    res.status(404).json({message: '4💕4 Not Found'})
})


//error handle
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
const database = process.env.DATABASE;



mongoose.connect(database)
.then(()=> {
	app.listen(port, ()=> {
		console.log(`Server Run Successfully at http://localhost:${port}`);
	})
}).catch(error => {
    console.log(error.message)
})