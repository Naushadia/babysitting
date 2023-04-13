const { validationResult } = require("express-validator");
const db = require("../models");
const { error, success } = require("../utils/responseWrapper");
const User = db.user;
const { Sequelize, Op } = require("sequelize");

exports.findNanny = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { distance } = req.body;

    const lat = req.user.latitude;

    const lng = req.user.longitude;

    const nanny = await User.findAll({
      where: { account_type: "nanny" },
      order: db.sequelize.literal(
        `(6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude))))`
      ),
      attributes: [
        'first_name','last_name','email','verified','account_type',
        [
          db.sequelize.literal(
            `(6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude))))`
          ),
          "distance",
        ],
      ],
    });

    return res
      .status(200)
      .json({ nanny: nanny, msg: "nanny found sucessfully" });
  } catch (e) {
    console.error(e);
    return res.send(error(400, "something went wrong"));
  }
};
