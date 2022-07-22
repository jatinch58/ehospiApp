const axios = require("axios");
const userdb = require("../models/userProfile.js");
const jwt = require("jsonwebtoken");
const tokendb = require("../models/refreshToken");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const Joi = require("joi");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  Bucket: process.env.BUCKET_NAME,
});
//==========================================phone login=======================================//
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
          "https://2factor.in/API/V1/" +
            process.env.TWO_FACTOR +
            "/SMS/" +
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
//===========================================verifyOTP========================================//
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
          "https://2factor.in/API/V1/" +
            process.env.TWO_FACTOR +
            "/SMS/VERIFY/" +
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
              const token = jwt.sign({ uid: myuid }, process.env.TOKEN_PASS, {
                expiresIn: "1m",
              });
              res.status(200);
              res.send({
                uid: myuid,
                token: token,
                refreshToken: myRefreshToken,
              });
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
//=========================================create profile=====================================//
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
//=========================================Show Profile=======================================//
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
//=========================================refresh token======================================//
exports.refreshToken = async (req, res) => {
  try {
    const p = await tokendb.findOne({
      uid: req.body.uid,
      refreshToken: req.body.refreshToken,
    });
    if (p) {
      const token = jwt.sign({ uid: p.uid }, process.env.TOKEN_PASS, {
        expiresIn: "1m",
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
//=======================================isAlreadyRegistered==================================//
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
//=======================================update profile=======================================//
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
        const token = jwt.sign({ uid: myuid }, process.env.TOKEN_PASS, {
          expiresIn: "1m",
        });
        res.status(200).send({
          uid: myuid,
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
//=============================== upload profile picture ===========================================//
exports.uploadProfilePicture = async (req, res) => {
  try {
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params, async (error, data) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        const result = await userdb.findOneAndUpdate(
          { uid: req.user.uid },
          {
            imageUrl: data.Location,
          }
        );
        if (result) {
          res.status(200).send({ message: "New image added successfully" });
        } else {
          res.status(500).send({ message: "Something bad happened" });
        }
      }
    });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
//============================== get profile picture ===============================================//
exports.getProfilePicture = async (req, res) => {
  try {
    const result = await userdb.findOne(
      { uid: req.user.uid },
      { _id: 0, imageUrl: 1 }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(500).send({ message: "Something went wrong" });
    }
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
//================================ update profile picture ==========================================//
exports.updateProfilePicture = async (req, res) => {
  try {
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    };
    s3.upload(params, async (error, dataResult) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        let p = req.body.profileUrl;
        if (p) {
          p = p.split("/");
          p = p[p.length - 1];
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: p,
          };
          const s3delete = function (params) {
            return new Promise((resolve, reject) => {
              s3.createBucket(
                {
                  Bucket: params.Bucket,
                },
                function () {
                  s3.deleteObject(params, async function (err, data) {
                    if (err) res.status(500).send({ message: err });
                    else {
                      const result = await userdb.findOneAndUpdate(
                        { uid: req.user.uid },
                        {
                          imageUrl: dataResult.Location,
                        }
                      );
                      if (result) {
                        res
                          .status(200)
                          .send({ message: "Image updated successfully" });
                      } else {
                        res
                          .status(500)
                          .send({ message: "Something bad happened" });
                      }
                    }
                  });
                }
              );
            });
          };
          s3delete(params);
        } else {
          const result = await userdb.findOneAndUpdate(
            { uid: req.user.uid },
            {
              imageUrl: dataResult.Location,
            }
          );
          if (result) {
            res.status(200).send("updated sucessfully");
          } else {
            res.status(500).send({ message: "Something went wrong" });
          }
        }
      }
    });
  } catch (e) {
    res.status(500).send({ message: e.name });
  }
};
