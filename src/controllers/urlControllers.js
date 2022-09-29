//import urlModel from "../models/urlModel";
const urlModel=require("../models/urlModel")
//import shortid from "shortid";
const shortid=require("shortid")
//import validUrl from "valid-url"
const validUrl=require("valid-url")
// import  isUri  from "isuri";


const createUrl= async (req,res)=>{
    try{
    const longUrl=req.body.longUrl
    if(Object.keys(longUrl).length==0){
        return res.status(400).send({status:false,message:"Body should not be Empty"})}
    if(!longUrl || typeof longUrl !="string" || longUrl.trim().length ==0){
        return res.status(400).send({status:false,message:"Body should not be Empty"})}

        if(!validUrl.isUri(longUrl)){
            return res.status(400).send({status:false,message:"This URL link incorrect"})}

            const data =await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
            if(data){
                return res.status(200).send({status:false,message:"This URL already exist",data:data})}

             const urlString="http://localhost:3000/"
             const urlCode=shortid.generate().toLowerCase()
             const shortUrl=urlString + urlCode
             const saveData=await urlModel.create({longUrl,shortUrl,urlCode})

             let obj={
             longUrl:saveData.longUrl,
             shortUrl:saveData.shortUrl,
             urlCode:saveData.urlCode

             }

             return res.status(201).send({status:true,message:"successful",data:obj})
            }
        
  
    catch(err) {
       return res.status(500).send({status:false,message:err.message})
    }

}

module.exports.createUrl=createUrl



const getUrl= async (req,res)=>{
    try {
        const urlData=req.params.urlCode
      
        if(!urlData || typeof urlData !="string" || urlData.trim().length ==0){
            return res.status(400).send({status:false,message:"Params should not be Empty"})}
       
         const getUrl=await urlModel.findOne({urlCode:urlData})
           
            if(!getUrl){
                return res.status(404).send({status:false,message:"This URL code non found"})
 }
           return res.status(200).send({status:true,message:"successfull",data:getUrl.longUrl})
        
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}



module.exports.getUrl=getUrl