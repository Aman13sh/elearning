const express=require('express');

const {enrollUser }=require('./courseenrrolment.contoller');
const enrollRouter =  express.Router();

enrollRouter.put('/enroll',enrollUser)


module.exports=enrollRouter;