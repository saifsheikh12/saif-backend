const urlModel = require("../models/urlModel");
const shortid = require('shortid')

const {SET_ASYNC,GET_ASYNC}=require("./redis")

const axios=require("axios")


// Create Url

const createUrl = async function (req, res) {
  try {
    const longUrl = req.body.longUrl

    if(Object.keys(req.body).length == 0){
      return res.status(400).send({status:false, message:"Body should not be Empty."})
    }

    if (!longUrl || typeof longUrl != "string" || longUrl.trim().length == 0){
        return res.status(400).send({status:false, message:"LongUrl must be present and Typeof must be String."})
    }
    
    let ProfileData = await GET_ASYNC(`${longUrl}`);
    //  console.log(ProfileData.keys)
    ProfileData = JSON.parse(ProfileData)
 
    if (ProfileData) {
      
      return res.status(200).send({status:true,data:ProfileData,message:"coming from cache"})
    }
     else {

      let data =await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
      if(data){
       await SET_ASYNC(`${longUrl}`, JSON.stringify(data));
      res.status(200).send({status:true, message: " already exist in collection db",data:data})
    
       } else{

    let Url={
      method:"get",
      url:longUrl,
    }

    let checkingUrl=await axios(Url)
    .then(()=>longUrl)
    .catch(()=>null)

    if (!checkingUrl) {
            
      return res.status(400).send({ status: false, message: `This Link: ${longUrl} is not Valid URL.` }) }


    const str = 'http://localhost:3000/'
    const urlCode = shortid.generate().toLowerCase()

    const shortUrl = str + urlCode

    

    const savedData = await urlModel.create({longUrl, shortUrl, urlCode})

    await SET_ASYNC(`${urlCode}`, JSON.stringify(savedData))


   let obj = {
    longUrl: savedData.longUrl,
    shortUrl: savedData.shortUrl,
    urlCode: savedData.urlCode
}
// await SET_ASYNC(`${longUrl}`, JSON.stringify(obj))

    return res.status(201).send({ status: true, message: "successfully created", data: obj })

  }}}
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


// Get Url

const getUrl = async function (req, res) {
    try {
        
        const urlCode = req.params.urlCode
        
      
        let cahcedProfileData = await GET_ASYNC(`${urlCode}`);
    
        cahcedProfileData = JSON.parse(cahcedProfileData)
     
        if (cahcedProfileData) {
          
          return res.status(302).redirect(cahcedProfileData.longUrl);
          
        } else {
            const url = await urlModel.findOne({ urlCode: urlCode });
            
            if (!url) {
              return res.status(404).send({ message: "No url found" });
            }
          await SET_ASYNC(`${urlCode}`, JSON.stringify(url));
  
          return res.status(302).redirect(url.longUrl);
        }  
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports.createUrl=createUrl

module.exports.getUrl=getUrl