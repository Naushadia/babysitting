"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account_type: DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      latitude:DataTypes.DECIMAL(8,6),
      longitude: DataTypes.DECIMAL(9,6),
      createdAt: DataTypes.DATE(6),
      updatedAt: DataTypes.DATE(6),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
