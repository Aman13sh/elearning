const { Client } = require('pg')
const {pool} =require('../../config/dbconnect')
const cloudinary=require('cloudinary').v2
const bcrypt = require('bcrypt');
function isfileTypeSupported(type,supportedType){
    return supportedType.includes(type);
}
async function uploadFiletoCloudy(file,folder){
    const options={folder};
    console.log(options);
    return await cloudinary.uploader.upload(file.path,options);
  }
async function updateUserprofile(req,res){
    const obj = JSON.parse(JSON.stringify(req.body));
    const formvalue=JSON.parse(obj.body);
    const {u_name,email,password,repassword,isAdmin}=formvalue;
    const file=req.file;
    console.log(email);
   console.log(obj);
    const supportedType =["jpg","jpeg","png"]
    const fileType=file.originalname.split('.')[1].toLowerCase(); 
    if(!isfileTypeSupported(fileType,supportedType)){
        return res.status(400).json({
          sucess:false,
          message:"file format not supported"
        })
      }

      const response=await uploadFiletoCloudy(file,"chat");
      var hashPassword;
      try{
          hashPassword= await bcrypt.hash(password,10);
      }
      catch(e){
    
      }
        console.log(hashPassword);
        const client = await pool.connect();
        const text = 'UPDATE userDetails SET  profileAvtar=$2,u_name=$3,password=$4,isAdmin=$5  where email=$1'
        const values = [email,response.secure_url,u_name,hashPassword,isAdmin];

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
    updateUserprofile,
}