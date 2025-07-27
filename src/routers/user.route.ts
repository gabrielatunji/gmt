'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM,
      allowNull: true, // Changed to true to match the model
      values: ['Not Paid', 'Initiated', 'Subscribed'],
      defaultValue: 'Not Paid'
    });
    await queryInterface.addColumn('users', 'googleID', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'githubID', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['Not Paid', 'Initiated', 'Paid'], // Reverting to original values
      defaultValue: 'Not Paid'
    });
    await queryInterface.removeColumn('users', 'googleID');
    await queryInterface.removeColumn('users', 'githubID');
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false // Reverting to original value
    });
  }
};