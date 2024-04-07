const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')
const bcrypt = require('bcrypt');
const {Resend}=require('resend');
const resend = new Resend(process.env.RESEND_API);
require('dotenv').config();
function checkPasswordStrength(password){
  let uppercase=0,number=0;
  var character='';
  for(let i=0;i<password.length;i++){
    character = password.charAt(i);
    if (!isNaN(character * 1)){
      number++;
  }else{
      if (character == character.toUpperCase()) {
        uppercase++;
      }
     
  }

  }
  console.log(uppercase,number);
  if(uppercase >= 1 && number >= 2){
    return false;
  }
return true;
}
 async function registerUser(req,res){
    const {u_name,email,password,repassword,isAdmin} = req.body;
    if(!u_name || !email || !password || !repassword || !isAdmin){
      return res.status(400).json("Enter all details");
    }
    if(password !== repassword){
      return res.staus(400).json("Password dosen't match");
    }
    if(checkPasswordStrength(password)){
      return res.status(500).json({sucess:false,message:"Password strength is weak"});
    }
    const client = await pool.connect();
    var userPresence;
    try{
      //checking user is already present or not
      const query = {
        name: 'fetch-user',
        text: 'SELECT * FROM userDetails WHERE email = $1',
        values: [email],
      }
      userPresence = await client.query(query);
    }
    catch(error){
      return res.status(500).json({sucess:false,message:"error in query fetching"});
    }
    if(userPresence.rows.length != 0){
      return res.status(200).json({sucess:false,message:"user is already present"});
    }
    // Hashing Password
    var hashPassword;
    try{
        hashPassword= await bcrypt.hash(password,10);
    }
    catch(e){
        return res.status(500).json({
            sucess:false,
            message:'Error in hashing password',
        })
    }
    // Creating query to Post user details on db
    const text = 'INSERT INTO userdetails(u_name, email ,password,isAdmin) VALUES($1, $2, $3, $4) RETURNING *'
    const values = [u_name,email,hashPassword,isAdmin];
    // Posting user details
    try{
      const result = await client.query(text, values)
      res.status(200).json({sucess:true,message:"User is created"});
      }
      catch(error){
          return res.status(400).json({sucess:false,message:"Uer not created"});
      }
    finally {
      client.release();
    }
    sendMail(email);
}

async function sendMail(email){
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [`${email}`],
    subject: 'Elearning',
    html: '<strong>You succesfully register on e learning</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

module.exports={
    registerUser,
}
