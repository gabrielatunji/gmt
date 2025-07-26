'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM, 
      allowNull: false,
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
     await queryInterface.addColumn('users', 'subscriptionAmount', {
      type: Sequelize.NUMBER, 
      allowNull: false,
      defaultValue: 10000
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
