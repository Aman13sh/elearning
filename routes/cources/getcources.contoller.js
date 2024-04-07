const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')

async function getCources(req,res){
    const {courseName} = req.query;

    const client = await pool.connect();

    try{
        //fetching cousrces 
        const query = {
          name: 'fetch-cources',
          text: 'SELECT * FROM courseDetails WHERE c_Name = $1',
          values: [courseName],
        }
        coursePresence = await client.query(query);
        return res.status(200).json(coursePresence.rows);
      }
      catch(error){
        return res.status(500).json({sucess:false,message:"error in query fetching"});
      }
      finally {
        client.release();
      }

}

module.exports={
    getCources
}