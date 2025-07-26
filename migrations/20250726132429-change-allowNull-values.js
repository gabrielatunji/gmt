'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM, 
      allowNull: false,
      values: ['Not Paid', 'Initiated', 'Paid'],
      defaultValue: 'Not Paid'
    });
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    }); 
    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false
    }); 
    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false
    }); 
    await queryInterface.changeColumn('users', 'createdAt', {  
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'updatedAt', {  
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM,
      allowNull: true,
      values: ['Not Paid', 'Initiated', 'Paid'],
      defaultValue: 'Not Paid'
    });
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true
    });
     await queryInterface.changeColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};