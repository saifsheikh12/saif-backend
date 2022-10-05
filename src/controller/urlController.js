const urlModel = require('../models/urlModel');
const shortId = require('shortid');
const validUrl = require('validator');
const redis = require("redis");
const { promisify } = require("util");


const redisClient = redis.createClient(
    19384,
    "redis-19384.c264.ap-south-1-1.ec2.cloud.redislabs.com", { no_ready_check: true }
);



redisClient.auth("DW9FFZ4KeESrapZHdXuCsAjfXlQ4iWcJ", function(err) {
    if (err) throw err;
});




redisClient.on("connect" ,function(){
    console.log("redis is connected")
});



const SET_ASYNC=promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC=promisify(redisClient.GET).bind(redisClient)








function isValid(value) {  //function to validate string
    if (typeof value !== 'string' || value.trim().length == 0) return true
    if (value == undefined || value == null) return true
    return false
}



//===================================================[API:FOR CREATING SHORT URL]===========================================================
const shortUrl = async function (req, res) {
    try {
        let longUrl = req.body.longUrl
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please provide require data" })


        if (!longUrl) {
            return res.status(400).send({ status: false, message: "longUrl is must be present" });
        }
        if (!validUrl.isURL(longUrl)) {
            return res.status(400).send({ status: false, message: "please enter valid URL" })
        }
        let cachedUrl = await GET_ASYNC(`${longUrl}`)
        if(cachedUrl){
            cachedUrl = JSON.parse(cachedUrl)
            return res.status(200).send({status:true,message:"this url has already been shortend",data:cachedUrl})
        }

        let checkUrl = await urlModel.findOne({ longUrl }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        if (checkUrl) {
            return res.status(200).send({ status: true, message: "this url has already been shortend",data:checkUrl })
        }
        const urlCode = shortId.generate().toLowerCase();
        let baseUrl = "http://localhost:3000";

        const shortUrl = baseUrl + '/' + urlCode;

        req.body.shortUrl = shortUrl;
        req.body.urlCode = urlCode;

        await urlModel.create(req.body)
        let data = {};
        data.longUrl = longUrl;
        data.shortUrl = shortUrl;
        data.urlCode = urlCode
       

        return res.status(200).send({ status: true, data: data }) 


    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

//===================================================[API:FOR REDIRECTING TO LONG URL]===========================================================


const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode;
        if(!shortId.isValid(urlCode)){
            return res.status(400).send({status:false, message:"enter valid code"})
        }
        let cachedUrl = await GET_ASYNC(`${urlCode}`)
        if(cachedUrl){
            cachedUrl = JSON.parse(cachedUrl)
            return res.status(302).redirect(cachedUrl.longUrl)
        }
        else{
            let result = await urlModel.findOne({ urlCode }).select({ longUrl: 1 , shortUrl:1  , urlCode:1 , _id:0})
            if(!result){
                return res.status(404).send({staus:false,message:"no url exists"})
            }
            let longUrl = result.longUrl
            await SET_ASYNC(`${longUrl}`,JSON.stringify(`${result}`)) //key
            await SET_ASYNC(`${urlCode}`,JSON.stringify(`${result}`)) //key
            return res.status(302).redirect(longUrl)
            
            }

    } catch (err) {
        return res.status(500).send({ staus: false, error: err.message })
    }
}



module.exports.shortUrl=shortUrl
module.exports.getUrl=getUrl