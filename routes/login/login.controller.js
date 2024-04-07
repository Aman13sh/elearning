const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
require('dotenv').config();
async function loginUser(req,res){
    try{
        const {email,password}=req.body;
        //checking email or paswword is not null
        if(!email || !password){
            return res.status(400).json({
                sucess:false,
                message:"please fill al the detail"
            });
        }
        const client = await pool.connect();
        var user;
        try{
            //checking user is already present or not
            const query = {
              name: 'fetch-user',
              text: 'SELECT password,u_name FROM userDetails WHERE email = $1',
              values: [email],
            }
            user = await client.query(query);
            console.log(user.rows[0])
          }
        catch(error){
            console.log(error);
            return res.staus(400).json({sucess:false,message:"Db Query problem"});
        }
        if(user.rows.length == 0){
            return res.status(400).json({
                sucess:false,
                message:"user not exist"
            })
        }

        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        if(await bcrypt.compare(password,user.rows[0].password)){
            // password match
            let token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            const userD={
                u_name:user.rows[0].u_name,
                email:email,
                token:token,
            }
            const options={
                expire: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
           
            return res.cookie("token",token,options).status(200).json({
                sucess:true,
                userD,
                message:"user logged in sucessfully"
            })

        }
        else{
            //password do not match

            return res.status(403).json({
                sucess:false,
                message:"Password Incoreect"
            });
        }
    }
    catch(e){
        console.log(e);

        return res.status(500).json({
            sucess:false,
            message:"Login faled"
        })
    }

}

module.exports={loginUser};