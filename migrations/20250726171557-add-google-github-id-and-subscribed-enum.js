'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM,
      allowNull: true,
      values: ['Not Paid', 'Initiated', 'Subscribed'],
      defaultValue: 'Not Paid'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['Not Paid', 'Initiated', 'Paid'],
      defaultValue: 'Not Paid'
    });
  }
};