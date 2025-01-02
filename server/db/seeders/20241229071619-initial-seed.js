'use strict';

const { User } = require('../models');
const { hashSync } = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        name: 'Alex',
        email: 'alex@mail.com',
        hashpass: hashSync('123', 10),
      },

      {
        name: 'Bob',
        email: 'bob@mail.com',
        hashpass: hashSync('123', 10),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
