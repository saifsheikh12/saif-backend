const userModel=require("../model/userModel")

const createUser=async function(req,res){
    let isvalid= function(value){

    }
}



const login = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email) return res.status(400).send({ status: false, msg: "Please Input Email" });
        if (!password) return res.status(400).send({ status: false, msg: "Please Input Password" });
        let userData = await userModel.findOne({ email: email, password: password });
        if (!userData) return res.status(400).send({ status: false, msg: "No User Found With These Credentials" });
        let token = jwt.sign({ userid: userData._id, email: userData.email }, "Project-3");

        return res.status(200).send({ status: true, data: { token: token } })
    }
    catch (error) {
        return res.status(500).send({ status: false,message:"Author loggedIn Successfully", message: error.message })
    }
}


module.exports.login=login