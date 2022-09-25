const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken");

//-------------------------------------------common isvalid Function--------------------------//
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidBody = function (value) {
    if (Object.keys(value).length == 0) return true
    return false
}

const nameRegex = new RegExp(/^[a-z\s]+$/i)
const emailRegex = new RegExp(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
const mobileRegex = new RegExp(/^([6-9]\d{9})$/)
const passwordRegex = new RegExp(/^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/)
const pincodeRegex = new RegExp(/^[1-9][0-9]{5}$/)
const cityRegex = new RegExp(/^[a-z\s]+$/i)
//-------------------------------------------createUser------------------------------------------------//      
const createUser = async function (req, res) {
    try {
        let userData = req.body
        if (isValidBody(userData)) {
            return res.status(400).send({ status: false, message: "body cant be empty" })
        }
        let data = req.body
        let { title, name, phone, email, password, address } = data  // Destructuring

        //checking title Validation

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Please Provide Title" })
        }

        let titles = ["Mr", "Mrs", "Miss"]
        if (!titles.includes(title)) {
            return res.status(400).send({ status: false, message: `Title should be among  ${titles} or space is not allowed` })
        }

        //checking name Validation
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please Provide Name" })
        }
        if (!nameRegex.test(name)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Name" })
        }

        //checking phone validation
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Please Provide Mobile" })
        }
        if (!phone.match(mobileRegex)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Mobile" })
        }

        let duplicatePhone = await userModel.findOne({ phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "phone is already registered!" })
        }
        //checking email valiation
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please Provide Email" })
        }
        if (!email.match(emailRegex)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Email" })
        }
        let duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: "email is already registered!" })
        }

        //checking password validation
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please Provide password" })
        }
        if (!password.match(passwordRegex)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid password ,password must be 8 digit to 15 digit" })
        }

        //checking object validation
        if (address) {
            if (typeof (address) != "object" || Object.keys(address).length === 0) {
                return res.status(400).send({ status: false, message: "Please enter your address in object" })
            }

            if (address.street) {
                if (!isValid(address.street)) {
                    return res.status(400).send({ status: false, message: "street is not valid" })
                }
            }

            if (address.city) {
                if (!isValid(address.city) || !address.city.match(cityRegex)) {
                    return res.status(400).send({ status: false, message: "city is not valid" })
                }
            }
            if (address.pincode) {
                if (!isValid(address.pincode) || !address.pincode.match(pincodeRegex)) {
                    return res.status(400).send({ status: false, message: "Please Provide Valid Pincode" })
                }
            }
        }


        const userCreation = await userModel.create(req.body)
        return res.status(201).send({ status: true, message: 'Success', data: userCreation })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}



let loginUser = async function (req, res) {
    let loginData = req.body;
    if (isValidBody(loginData)) {
        return res.status(400).send({ status: false, message: "body cant be empty" })
    }
    let { email, password } = loginData;

    if (!isValid(email)) {
        return res.status(400).send({ status: false, message: "Please Provide Email" })
    }

    if (!isValid(password)) {
        return res.status(400).send({ status: false, message: "Please Provide password" })
    }

    let userData = await userModel.findOne({ email: email, password: password });
    if (!userData) {
        return res.status(400).send({ status: false, message: "password or emaild are invalid" });
    }

    let date = Date.now();
    // let createTime = Math.floor(date / 1000);
    // let expTime = createTime + 120;
    let createTime = Math.floor(Date.now() / 1000);
    let expTime = createTime + (60 * 60)


    let token = jwt.sign(
        {
            userId: userData._id.toString(),
            iat: createTime,
            exp: expTime,
        },
        "rahul_satyajit_mdsaifuddin_anul"
    );
    return res.status(201).send({ status: true, message: "success", data: token });
};

module.exports = { createUser, loginUser }
