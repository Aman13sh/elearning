const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')

async function updateUserprofileEmail(req,res){
    const {email,newemail}=req.body;
    const client = await pool.connect();
    const text = 'UPDATE userDetails SET  email=$2 where email=$1'
    const values = [email,newemail];


    try{
        await client.query(text, values)
        return res.status(200).json({sucess:true,message:"User data updated"});
        }
        catch(error){
            console.log(error);
            return res.status(400).json({sucess:false,message:"Uer data not updated"});
        }
      finally {
        client.release();
      }

}

module.exports={
    updateUserprofileEmail,
}