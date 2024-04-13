const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')
const {Resend}=require('resend');
require('dotenv').config();
const resend = new Resend(process.env.RESEND_API);
function isEnrroled(courseArr,courseId){
return courseArr.includes(courseId);
}
async function enrollUser(req,res){
    const {courseId,email}=req.body;

    const client = await pool.connect();
    //Checking user is already enrolled or not
    var alreadyEnrolled;
    try{
        //fetching cousrces 
        const query = {
          name: 'fetch-enrollcources',
          text: 'SELECT course_enroll FROM userDetails WHERE email = $1',
          values: [email],
        }
        const arr=[];
        const courseEnroll = await client.query(query);

        for(let i=0;i<courseEnroll.rows[0].course_enroll.length;i++){
            arr.push(courseEnroll.rows[0].course_enroll[i].id);
        }

        if(isEnrroled(arr,courseId)){
            alreadyEnrolled=true;
        }
    }
    catch(error){
        return res.status(404).json({sucess:false,message:"Error in query fetching"});
    }
    if(alreadyEnrolled){
        return res.status(200).json("Already enorlled in course");
    }

    //posting enrollement details
    const text = `UPDATE userdetails SET course_enroll = course_enroll || ARRAY['{"id":"${courseId}"}']::JSON[] where email=$1`
    const values = [email];
    console.log(values);
 
    try{
        await client.query(text, values)
        res.status(200).json({sucess:true,message:"User is Enrollerd"});
   
      }
      catch(error){
        console.log(error);
          return res.status(400).json({sucess:false,message:"User is not enrolled"});
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
    html: '<strong>You succesfully enrolled in course</strong>',
  });
}
module.exports={
    enrollUser,
}