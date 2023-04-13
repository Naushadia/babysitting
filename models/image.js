"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  image.init(
    {
      id_name: DataTypes.STRING,
      image: DataTypes.STRING,
      createdAt: DataTypes.DATE(6),
      updatedAt: DataTypes.DATE(6),
    },
    {
      sequelize,
      modelName: "image",
    }
  );
  return image;
};
