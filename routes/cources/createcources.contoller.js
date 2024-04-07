const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')
async function createcources(req,res){

    const {courseId,c_name,price,creator,discription,email} = req.body;

    
    if(!courseId || !c_name || !price || creator || discription || email){
      return res.status(500).json({sucess:false,message:"All details not filled"});
    }
    const client = await pool.connect();
    var isAdmin;
    try{
        //checking user is Admin or not
        const query = {
          name: 'fetch-user',
          text: 'SELECT isAdmin FROM userDetails WHERE email = $1',
          values: [email],
        }
        isAdmin = await client.query(query);
      }
      catch(error){
        console.log(error);
        return res.status(500).json({sucess:false,message:"error in query fetching"});
      }

      if(isAdmin.rows[0].isadmin == false){
        return res.status(500).json({sucess:false,message:"you are not a admin"});
      }

    var courseIDPresence;
    try{
      //checking course is already present or not
      const query = {
        name: 'fetch-cources',
        text: 'SELECT * FROM coursedetails WHERE id_s = $1',
        values: [courseId],
      }
      courseIDPresence= await client.query(query);
    }
    catch(error){
      console.log(error);
      return res.status(500).json({sucess:false,message:"error in query fetching"});
    }

    if(courseIDPresence.rows.length != 0){
        return res.status(200).json({sucess:false,message:"course is already present"});
    }


    const text = 'INSERT INTO coursedetails(id_s, discription , price , creator , c_name) VALUES($1, $2, $3, $4 ,$5 )'
    const values = [courseId,discription,price,creator,c_name];
    
    
    // Posting course details
    try{
      await client.query(text, values)
      return res.status(200).json({sucess:true,message:"User is created"});
      }
      catch(error){
        console.log(error);
          return res.status(400).json({sucess:false,message:"Uer not created"});
      }
    finally {
      client.release();
    }

}
module.exports={
    createcources,
}