var db = require("../models");

const User = db.user;
const Otp = db.otp;
const { error, success } = require("../utils/responseWrapper");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const { Sequelize, Op } = require("sequelize");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "eugene.mckenzie49@ethereal.email",
    pass: "KJxe5A6kgr314Nnrfu",
  },
});

const signupController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      first_name,
      last_name,
      email,
      password,
      account_type,
      latitude,
      longitude,
    } = req.body;

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !account_type ||
      !latitude ||
      !longitude
    ) {
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res.send(error(409, "User is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      account_type,
      password: hashedPassword,
      latitude,
      longitude,
      verified: 0,
    });

    const accessToken = generateAccessToken({ user });

    const refreshToken = generateRefreshToken({ user });

    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    await Otp.create({
      otp,
      email,
    });

    const cookieotp = generateAccessToken({ otp, user });

    await transporter.sendMail({
      to: email,
      from: "no-reply@babysitter.com",
      subject: "please verify your email",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>" +
        "<h3> Click this <a href='" +
        req.protocol +
        "://" +
        req.headers.host +
        "/users/verify/" +
        email +
        "'>link</a> to verify your email</h3>",
    });

    const options = { httpOnly: true, secure: true };
    res.cookie("jwt", refreshToken, options);
    res.cookie("otp", cookieotp, { options, maxAge: 15 * 60 * 1000 });

    return res.send(
      success(201, {
        user,
        accessToken,
        msg: "please check your mail for verification",
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(400, "something went wrong"));
  }
};

const reSendEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.send(error(400, "Email is required"));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send(error(404, "User is not registered"));
    }

    if (user.verified === true) {
      return res.send(error(404, "User email is already verified"));
    }

    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    const otps = await Otp.findOne({ where: { email } });
    otps.otp = otp;
    otps.save();

    const cookieotp = generateAccessToken({ otp, user });

    await transporter.sendMail({
      to: email,
      from: "no-reply@babysitter.com",
      subject: "please verify your email",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>" +
        "<h3> Click this <a href='" +
        req.protocol +
        "://" +
        req.headers.host +
        "/users/verify/" +
        email +
        "'>link</a> to verify your email</h3>",
    });

    const options = { httpOnly: true, secure: true };
    res.cookie("otp", cookieotp, { options, maxAge: 15 * 60 * 1000 });

    return res.send(success(200, "email sent sucessfully"));
  } catch (e) {
    console.error(e);
    return res.send(error(400, "something went wrong"));
  }
};

const verifyEmailController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.params.email;
  const { otp } = req.body;
  try {
    const storedOtp = await Otp.findOne({ where: { email: email } });
    if (storedOtp.otp == otp) {
      await Otp.destroy({ where: { email } });
      const user = await User.findOne({ where: { email } });
      user.verified = 1;
      user.save();

      return res.send(success(200, "email verified"));
    } else {
      return res.send(error(400, "otp expired"));
    }
  } catch (e) {
    console.log(e);
    return res.send(error(404, "Something went wrong"));
  }

  // otp verification using cookie

  // const cookies = req.cookies;
  // const cookieotp = cookies.otp;
  // const { otp } = req.body;
  // try {
  //   const decoded = jwt.verify(cookieotp, process.env.ACCESS_TOKEN_PRIVATE_KEY);
  //   if (decoded.otp == otp) {
  //     await Otp.destroy({ where: { email: decoded.user.email } });
  //     const user = await User.findOne({ where: { email: decoded.user.email } });
  //     user.verified = 1;
  //     user.save();

  //     return res.send(success(200, "email verified"));
  //   } else {
  //     return res.send(error(400, "invalid otp"));
  //   }
  // } catch (e) {
  //   console.error(e);
  //   return res.send(error(400, "something went wrong"));
  // }
};

// const otpexpire = async (req, res) => {
//   cron.schedule('*/15 * * * *', async () => {
//     const expiryDate = new Date();
//     expiryDate.setMinutes(expiryDate.getMinutes() - 15);

//     await Otp.destroy({
//       where: {
//         otp: {
//           [Op.lte]: expiryDate,
//         },
//       },
//     });
//   });
// };

const loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send(error(404, "User is not registered"));
    }

    if (user.verified !== true) {
      return res.send(error(404, "User email is not verified"));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.send(error(403, "Incorrect password"));
    }

    const accessToken = generateAccessToken({ user });

    const refreshToken = generateRefreshToken({ user });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(
      success(200, {
        accessToken,
      })
    );
  } catch (e) {
    console.log(e);
    return res.send(error(400, "something went wrong"));
  }
};

const forgetPasswordController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email } = req.body;

    if (!email) {
      return res.send(error(400, "E-mail is required"));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send(error(404, "User is not registered"));
    } else {
      const token = jwt.sign({ user }, process.env.SECRET_CODE, {
        expiresIn: "24h",
      });
      const mailer = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "eugene.mckenzie49@ethereal.email",
          pass: "KJxe5A6kgr314Nnrfu",
        },
      });
      await mailer.sendMail({
        from: "no-reply@babysitter.in",
        to: user.email,
        subject: "hello",
        html: `<h3> Click this <a href="${req.protocol}://${req.headers.host}/users/reset/${token}">link</a> to change your password</h3>`,
      });

      return res.send(
        success(200, "we have sent instructions to reset password")
      );
    }
  } catch (e) {
    console.log(e);
    return res.send(error(400, "something went wrong"));
  }
};

const updatePasswordController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { old_password, new_password } = req.body;

    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      const matched = await bcrypt.compare(old_password, user.password);
      if (!matched) {
        return res.send(error(400, "old password must be matched"));
      }
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
      user.password = hashedPassword;
      user.save();
      return res.send(success(200, "Password reset successfully"));
    }
  } catch (err) {
    console.log(err);
    return res.send(error(400, "something went wrong"));
  }
};
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401, "Refresh token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const user = decoded.user;
    const accessToken = generateAccessToken({ user });

    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    return res.send(error(401, "invalid refresh token"));
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.log(error);
    return res.send(error(400, "something went wrong"));
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (error) {
    console.log(error);
    return res.send(error(400, "something went wrong"));
  }
};

const getNewpassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const token = req.params.token;
  const { new_password } = req.body;
  if (!new_password) {
    return res.json({ msg: "please enter the password" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_CODE);
      if (decoded) {
        const user = await User.findOne({ where: { id: decoded.user.id } });
        if (user) {
          const hashedPassword = await bcrypt.hash(new_password, 10);
          user.password = hashedPassword;
          user.save();
        } else {
          return res.send(error(400, "invalid user"));
        }
        return res.send(
          success(200, "we have successfully reset your password")
        );
      } else {
        return res.send(error(400, "invalid token"));
      }
    } catch (e) {
      console.log(e);
      return res.send(error(400, "something went wrong"));
    }
  }
};

function mapUserRowsAndCounts(user) {
  return user.rows.map((row, index) => {
    if (user.count[index]) {
      return {
        ...row,
        Users: user.count[index].count,
      };
    } else {
      console.log("No count found for user:", row.id);
      return row;
    }
  });
}

const findUser = async (req, res, next) => {
  const limit = 3;

  const page = req.query.page || 1;

  const offset = (page - 1) * limit;
  const { search, block } = req.body;
  switch (true) {
    case !block && !search:
      let user, userData;
      user = await User.findAndCountAll({
        group: ["user.id"],
        raw: true,
        limit: limit,
        offset: offset,
      });

      userData = mapUserRowsAndCounts(user);

      return res.status(200).json({
        data: userData,
      });
    case block && !search:
      let user1, userData1;
      user1 = await User.findAndCountAll({
        where: { account_type: block },
        group: ["user.id"],
        raw: true,
        limit: limit,
        offset: offset,
      });
      userData1 = mapUserRowsAndCounts(user1);

      return res.status(200).json({
        data1: userData1,
      });
    case search && !block:
      let user2, userData2;
      user2 = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { first_name: { [Sequelize.Op.like]: "%" + search + "%" } },
            { last_name: { [Sequelize.Op.like]: `%${search}%` } },
            { email: { [Sequelize.Op.like]: `%${search}%` } },
          ],
        },
        group: ["user.id"],
        raw: true,
        limit: limit,
        offset: offset,
      });
      userData2 = mapUserRowsAndCounts(user2);

      return res.status(200).json({
        data2: userData2,
      });
    default:
      let user3, userData3;
      user3 = await User.findAndCountAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { first_name: { [Sequelize.Op.like]: "%" + search + "%" } },
                { last_name: { [Sequelize.Op.like]: `%${search}%` } },
                { email: { [Sequelize.Op.like]: `%${search}%` } },
              ],
            },
            { account_type: block },
          ],
        },
        group: ["user.id"],
        raw: true,
        limit: limit,
        offset: offset,
      });

      userData3 = mapUserRowsAndCounts(user3);

      return res.status(200).json({
        data3: userData3,
      });
  }
};

const decodeToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = req.user;
    return res.status(200).json({ user: user });
  } catch (e) {
    console.error(e);
    return res.send(error(400, "something went wrong"));
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  forgetPasswordController,
  updatePasswordController,
  getNewpassword,
  findUser,
  verifyEmailController,
  reSendEmail,
  decodeToken,
};
