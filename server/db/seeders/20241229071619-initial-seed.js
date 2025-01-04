'use strict';

const { User, Subscription, Photo } = require('../models');
const { hashSync } = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        name: 'Rex',
        nickname: 'FoxRex',
        email: 'rex@mail.com',
        img: 'img-1735829946208-299375998.jpeg',
        hashpass: hashSync('qwertY1@', 10),
      },

      {
        name: 'Bob',
        nickname: 'Happy Hippo',
        email: 'bob@mail.com',
        img: 'img-1735830046535-510343245.jpeg',
        hashpass: hashSync('qwertY1@', 10),
      },

      {
        name: 'Woo',
        nickname: 'BigEye',
        email: 'woo@mail.com',
        img: 'img-1735830103507-805605769.webp',
        hashpass: hashSync('qwertY1@', 10),
      },
    ]);

    await Subscription.bulkCreate([
      {
        subscriberId: 1,
        subscribedToId: 2,
      },

      {
        subscriberId: 3,
        subscribedToId: 2,
      },
    ]);

    await Photo.bulkCreate([
      {
        ownerId: 1,
        pic: '001.jpg',
        desc: 'nature',
      },

      {
        ownerId: 1,
        pic: '010.jpg',
        desc: 'nature again',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Subscriptions', null, {});
    await queryInterface.bulkDelete('Photos', null, {});
  },
};
