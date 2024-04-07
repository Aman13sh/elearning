const express = require("express");
const multer  = require('multer')
var multParse = multer()
var path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, (file.originalname)) 
    }
  })
const upload = multer({ storage: storage });
const updateRouter = express.Router();

const {updateUserprofile}=require('./update.controller')
const {updateUserprofileEmail}=require('./updateemail.controller');
updateRouter.put('/updateProfile',upload.single('file'),updateUserprofile)
updateRouter.put('/updateProfileEmail',updateUserprofileEmail)

module.exports=updateRouter;       