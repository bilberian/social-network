'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // Подписчики
      this.belongsToMany(User, {
        through: 'Subscriptions',
        as: 'Subscribers',
        foreignKey: 'subscribedToId',
      });

      // Подписки
      this.belongsToMany(User, {
        through: 'Subscriptions',
        as: 'Following',
        foreignKey: 'subscriberId',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      hashpass: DataTypes.STRING,
      img: DataTypes.STRING,
      nickname: DataTypes.STRING,
      city: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
