
const express = require('express');


const getenrollmentRouter=express.Router();

const {getenrollment}=require('././getenrollment.contoller');
getenrollmentRouter.get('/getenrollment',getenrollment);

module.exports=getenrollmentRouter;
