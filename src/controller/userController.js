const userModel=require("../model/userModel")
const jwt = require("jsonwebtoken");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
   const createUser = async function (req, res) {
    try {

        const nameRegex = /^[a-z\s]+$/i
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
        const mobileRegex = /^([6-9]\d{9})$/
        const passwordRegex = /^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/
        const pincodeRegex = /^[1-9][0-9]{6}$/

       let data= req.body
        let { title, name, email, phone, password, address } = data  // Destructuring

        if (Object.keys(data).length === 0)
        {
            return res.status(400).send({ status: false, message: "Please give some data" });
        }


        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Please Provide Title" })
        let titles = ["Mr", "Mrs", "Miss"]
        if (!titles.includes(title)) return res.status(400).send({ status: false, msg: `Title should be among  ${titles} or space is not allowed` })


        if (!isValid(name)) return res.status(400).send({ status: false, msg: "Please Provide Name" })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, msg: "Please Provide Valid Name" })


        if (!isValid(phone)) return res.status(400).send({ status: false, msg: "Please Provide Mobile" })
        if (!phone.match(mobileRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Mobile" })

        let duplicatePhone = await userModel.findOne({ phone })
        if (duplicatePhone) return res.status(400).send({ status: false, msg: "phone is already registered!" })

        if (!isValid(email)) return res.status(400).send({ status: false, msg: "Please Provide Email" })
        if (!email.match(emailRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Email" })


        let duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) return res.status(400).send({ status: false, msg: "email is already registered!" })


        if (!isValid(password)) return res.status(400).send({ status: false, msg: "Please Provide password" })
        if (!password.match(passwordRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid password ,password must be 8 digit to 15 digit" })


       {             // Nested If used here
            if (!isValid(address)) return res.status(400).send({ status: false, msg: "Please enter your address!" })
            if (address.pincode.match(pincodeRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Pincode" })
        }

        const userCreation = await userModel.create(req.body)
        res.status(201).send({ status: true, message: 'Success', data: userCreation })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
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

        //===========================================  token creation ==============================================================//
        let token = jwt.sign({ userId: userData._id, email: userData.email , 
             iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
    }, "Project-3" );
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true,message:" loggedIn Successfully",data: { token: token } })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports={createUser,login}
