'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'ownerId' });
    }
  }
  Photo.init(
    {
      ownerId: DataTypes.INTEGER,
      pic: DataTypes.STRING,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Photo',
    },
  );
  return Photo;
};
