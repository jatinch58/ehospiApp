const axios = require("axios");
const userdb = require("../models/userProfile.js");
const jwt = require("jsonwebtoken");
const tokendb = require("../models/refreshToken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
//////////////////////////////////////phone login///////////////////////////
exports.phoneLogin = (req, res) => {
  try {
    const { body } = req;
    const phoneSchema = Joi.object()
      .keys({
        phone: Joi.string()
          .regex(/^[6-9]{1}[0-9]{9}$/)
          .required(),
      })
      .required();
    let result = phoneSchema.validate(body);
    if (result.error) {
      res.status(400).send({ message: "Please enter a valid number" });
    } else {
      axios
        .get(
          "https://2factor.in/API/V1/c7573668-cfde-11ea-9fa5-0200cd936042/SMS/" +
            req.body.phone +
            "/AUTOGEN"
        )
        .then(function (response) {
          res.status(200).send(response.data);
        })
        .catch((er) => {
          res.status(500).send({ message: "Error" });
        });
    }
  } catch (er) {
    res.status(500).send({ message: "Error" });
  }
};
//////////////////////////////////verifyOTP/////////////////////////////////
exports.verifyOTP = async (req, res) => {
  try {
    const { body } = req;
    const otpSchema = Joi.object()
      .keys({
        details: Joi.string().required(),
        otp: Joi.number().max(999999).required(),
        phone: Joi.string()
          .regex(/^[6-9]{1}[0-9]{9}$/)
          .required(),
      })
      .required();
    let result = otpSchema.validate(body);
    if (result.error) {
      res.status(400).send({ message: "Please enter a valid details" });
    } else {
      axios
        .get(
          "https://2factor.in/API/V1/c7573668-cfde-11ea-9fa5-0200cd936042/SMS/VERIFY/" +
            req.body.details +
            "/" +
            req.body.otp
        )
        .then(async function (response) {
          if (response.data.Details === "OTP Matched") {
            const myuid = "ph" + req.body.phone;
            const myRefreshToken = uuidv4();
            await tokendb.findOneAndDelete({ uid: myuid });
            const createRefreshToken = new tokendb({
              uid: myuid,
              refreshToken: myRefreshToken,
            });
            const n = await createRefreshToken.save();

            if (n) {
              const token = jwt.sign({ uid: myuid }, "123456", {
                expiresIn: "30m",
              });
              res.status(200);
              res.send({ token: token, refreshToken: myRefreshToken });
            } else {
              res.status(500).send({ message: "Something bad happened" });
            }
          }
        });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
/////////////////////////////////create profile///////////////////////////////////////////////
exports.createProfile = async (req, res) => {
  try {
    const { body } = req;
    const profileSchema = Joi.object()
      .keys({
        fullName: Joi.string().required(),
        dateOfBirth: Joi.date().less("now").greater("01-01-1920").required(),
        gender: Joi.string().valid("Male", "Female", "Other").required(),
        email: Joi.string().email().required(),
      })
      .required();
    let result = profileSchema.validate(body);
    if (result.error) {
      res.status(400).send({ message: "Please enter a valid details" });
    } else {
      const userExist = await userdb.findOne({ uid: req.user.uid });
      if (!userExist) {
        const createUser = new userdb({
          uid: req.user.uid,
          fullName: req.body.fullName,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          email: req.body.email,
        });
        await createUser.save();
        res.status(200).send({ message: "Registered sucessfully" });
      } else {
        res.status(409).send({ message: "Profile already created" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
/////////////////////////////Show Profile/////////////////////////////////////
exports.showProfile = async (req, res) => {
  try {
    const userExist = await userdb.findOne(
      { uid: req.user.uid },
      { _id: 0, __v: 0 }
    );
    if (!userExist) {
      res.status(404).send({ message: "no data found" });
    } else {
      res.status(200).send(userExist);
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
////////////////////////////refresh token//////////////////////////////////
exports.refreshToken = async (req, res) => {
  try {
    const p = await tokendb.findOne({
      uid: req.body.uid,
      refreshToken: req.body.refreshToken,
    });
    if (p) {
      const token = jwt.sign({ uid: p.uid }, "123456", {
        expiresIn: "30m",
      });
      const myRefreshToken = uuidv4();
      const p2 = await tokendb.findOneAndUpdate(
        { uid: req.body.uid, refreshToken: req.body.refreshToken },
        { refreshToken: myRefreshToken }
      );
      if (p2) {
        res.status(200).send({ token: token, refreshToken: myRefreshToken });
      } else {
        res.status(503).send({ message: "Something bad happened" });
      }
    } else {
      res.status(501).send({ message: "Wrong refresh token" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
//////////////////////////////isAlreadyRegistered///////////////////////////////////
exports.isAlreadyRegistered = async (req, res) => {
  try {
    const userExist = await userdb.findOne({ uid: req.user.uid });
    if (!userExist) {
      res.status(200).send({ message: "No data found" });
    } else {
      res.status(200).send({ message: "User already registered" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
/////////////////////////////////update profile///////////////////////////////////////////////
exports.updateProfile = async (req, res) => {
  try {
    const { body } = req;
    const profileSchema = Joi.object()
      .keys({
        fullName: Joi.string().required(),
        dateOfBirth: Joi.date().less("now").greater("01-01-1920").required(),
        gender: Joi.string().valid("Male", "Female", "Other").required(),
        email: Joi.string().email().required(),
      })
      .required();
    let result = profileSchema.validate(body);
    if (result.error) {
      res.status(400).send({ message: "Please enter a valid details" });
    } else {
      const result = await userdb.findOneAndUpdate(
        { uid: req.user.uid },
        {
          fullName: req.body.fullName,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          email: req.body.email,
        }
      );
      if (result) {
        res.status(200).send({ message: "profile updated sucessfully" });
      } else {
        res.status(404).send({ message: "profile not found of this uid" });
      }
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
//===========================Facebook login==========================//
exports.checkFacebookToken = async (req, res) => {
  try {
    const accessToken = req.body.token;
    const check = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}`
    );
    if (req.body.id === check.data.id) {
      const myuid = "fb" + check.data.id;
      const myRefreshToken = uuidv4();
      await tokendb.findOneAndDelete({ uid: myuid });
      const createRefreshToken = new tokendb({
        uid: myuid,
        refreshToken: myRefreshToken,
      });
      const n = await createRefreshToken.save();

      if (n) {
        const token = jwt.sign({ uid: myuid }, "123456", {
          expiresIn: "24h",
        });
        res.status(200).send({
          token: token,
          refreshToken: myRefreshToken,
          imageUrl: req.body.picture,
          name: check.data.name,
          email: req.body.email,
        });
      } else {
        res.status(500).send({ message: "Something bad happened" });
      }
    } else {
      res.status(500).send({ message: "Something bad happened" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
