'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Subscription, Photo }) {
      // Подписчики
      this.belongsToMany(User, {
        through: Subscription,
        as: 'Subscribers',
        foreignKey: 'subscribedToId',
      });

      // Подписки
      this.belongsToMany(User, {
        through: Subscription,
        as: 'Following',
        foreignKey: 'subscriberId',
      });

      // Фотографии
      this.hasMany(Photo, { foreignKey: 'ownerId' });
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
