const express=require('express');

const {registerUser }=require('./register.controller.js');
const registerRouter =  express.Router();

 registerRouter.post('/register',registerUser)


module.exports=registerRouter;