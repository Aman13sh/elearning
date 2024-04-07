const express = require('express');

const createcourcesRouter=express.Router();

const {createcources}=require('./createcources.contoller');
const {deletecources}=require('./createcources.contoller');
createcourcesRouter.post('/createcources',createcources);
createcourcesRouter.put('/deletecreatecources',deletecources);
module.exports=createcourcesRouter;