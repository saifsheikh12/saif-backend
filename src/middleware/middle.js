const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const authentication = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).send({ status: false, message: "required token" });
    }

    jwt.verify(token, "Project-3", function (err, decodedToken) {
      if (err) {
        return res.status(401).send({ status: false, message: "token is invalid" });
      }
      if (Date.now() > decodedToken.exp * 1000) {
        return res.status(401).send({ status: false, message: "Token expired" }); //checking if the token is expired
      }
      else {
        req.decoded = decodedToken;
        next();
      }
    });
  }

  catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

const authorization = async function (req, res, next) {
  try {
    const userId = req.decoded.userId;
    const Id = req.body.userId;

    if (!ObjectId.isValid(Id)) {
      return res.status(400).send({ status: false, message: "invalid userId" });
    }
    if (userId !== Id) {
      return res
        .status(403)
        .send({ status: false, message: "user not authorized" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

module.exports = { authentication, authorization };