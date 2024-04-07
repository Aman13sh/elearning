const express = require('express');

const createcourcesRouter=express.Router();

const {createcources}=require('./createcources.contoller');
createcourcesRouter.post('/createcources',createcources);

module.exports=createcourcesRouter;