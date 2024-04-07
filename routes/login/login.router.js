const express = require('express');

const loginRouter = express.Router();

const {loginUser}=require('./login.controller')

loginRouter.post('/login',loginUser)


module.exports=loginRouter;