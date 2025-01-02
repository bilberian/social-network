'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {

    static associate(models) {
      // define association here
    }
  }
  Subscription.init({
    subscriberId: DataTypes.INTEGER,
    subscribedToId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Subscription',
  });
  return Subscription;
};