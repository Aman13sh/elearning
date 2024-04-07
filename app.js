const express = require('express');
var morgan = require('morgan')
const registerRouter= require('./routes/register/register.router.js')
const loginRouter= require('./routes/login/login.router.js')
const updateRouter= require('./routes/updateprofiles/update.router.js')
const getcourcesRouter = require('./routes/cources/getcources.router.js');
const createcourcesRouter = require('./routes/cources/createcources.router.js');
const enrollRouter = require('./routes/courseenrrolment/courseenrollment.router.js');
const getenrollmentRouter = require('./routes/getenrollment/getenrollment.router.js');
const app=express();

app.use(morgan('combined'));
app.use(express.json());

const cloudinary=require("./config/cloundary.js");
cloudinary.cloudinaryConnect();
app.use('/v1',registerRouter);
app.use('/v1',loginRouter);
app.use('/v1',updateRouter)
app.use('/v1',getcourcesRouter);
app.use('/v1',createcourcesRouter);
app.use('/v1',enrollRouter);
app.use('/v1',getenrollmentRouter);



module.exports=app;