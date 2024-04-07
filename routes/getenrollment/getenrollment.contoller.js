const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')

async function getenrollment(req,res){

    const{email}=req.body;
    const client = await pool.connect();
    try{
        //fetching cousrces 
        const query = {
          name: 'fetch-enrollcources',
          text: 'SELECT course_enroll FROM userDetails WHERE email = $1',
          values: [email],
        }
        const courseEnroll = await client.query(query);
        console.log(courseEnroll);
        console.log(courseEnroll.rows[0].course_enroll);
        var arr=[];
        for(let i=0;i<courseEnroll.rows[0].course_enroll.length;i++){
            arr.push(courseEnroll.rows[0].course_enroll[i].id);
        }
        var resarr=[];
        for(let i=0;i<arr.length;i++){
            const query = {
                name: 'fetch-cources',
                text: 'SELECT *  FROM coursedetails WHERE id_s = $1',
                values: [arr[i]],
              }
              const course = await client.query(query);
              resarr.push(course.rows);
        }
        return res.status(200).json(resarr);
    }
      catch(error){
        console.log(error);
        return res.status(500).json({sucess:false,message:"error in query fetching"});
      }
      finally {
        client.release();
      }
  

}
module.exports={
    getenrollment,
}