const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");

exports.admin = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(error(401, "Authorization Header is required"));
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = decoded.user;
    req.role = decoded.user.account_type;
    verified = decoded.user.verified;
    if (req.role === 'admin' && verified === true ) {
        next();
    } else {
        return res.send(error(401, "Unauthorized Access"));
    }
  } catch (e) {
    console.log(e);
    return res.send(error(401, "Invalid Access Key"));
  }
};

exports.nanny = async (req, res, next) => {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.send(error(401, "Authorization Header is required"));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      req.user = decoded.user;
      req.role = decoded.user.account_type;
      verified = decoded.user.verified;
      if (req.role === 'admin' && verified === true) {
          next();
      } else {
          return res.send(error(401, "Unauthorized Access"));
      }
    } catch (e) {
      console.log(e);
      return res.send(error(401, "Invalid Access Key"));
    }
  }

  exports.parent = async (req, res, next) => {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.send(error(401, "Authorization Header is required"));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      req.user = decoded.user;
      req.role = decoded.user.account_type;
      verified = decoded.user.verified;
      if (req.role === 'parent' && verified === true) {
          next();
      } else {
          return res.send(error(401, "Unauthorized Access"));
      }
    } catch (e) {
      console.log(e);
      return res.send(error(401, "Invalid Access Key"));
    }
  }

  exports.user = async (req, res, next) => {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.send(error(401, "Authorization Header is required"));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      req.user = decoded.user;
      verified = decoded.user.verified;
      if (verified === true) {
        next();
    } else {
        return res.send(error(401, "Please Verify your mail"));
    }
    } catch (e) {
      console.log(e);
      return res.send(error(401, "Invalid Access Key"));
    }
  }
