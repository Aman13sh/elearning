const express = require('express');


const getcourcesRouter=express.Router();

const {getCources}=require('./getcources.contoller');
getcourcesRouter.get('/cources',getCources);

module.exports=getcourcesRouter;