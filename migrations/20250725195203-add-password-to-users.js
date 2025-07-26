'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'password', {  //Change password to allowNull: true
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
    await queryInterface.changeColumn('users', 'paymentStatus', {
      type: Sequelize.ENUM('Not Paid', 'Paid'),
      allowNull: true,
      defaultValue: 'Not Paid'
    });
    await queryInterface.changeColumn('users', 'isSubscribed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.changeColumn('users', 'paymentDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.changeColumn('users', 'tx_Ref', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'createdAt', {  //Add timestamps
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'updatedAt', {  //Add timestamps
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'firstName');
    await queryInterface.removeColumn('users', 'lastName');
    await queryInterface.removeColumn('users', 'paymentStatus');
    await queryInterface.removeColumn('users', 'isSubscribed');
    await queryInterface.removeColumn('users', 'paymentDate');
    await queryInterface.removeColumn('users', 'tx_Ref');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
    await queryInterface.changeColumn('users', 'password', {  //Revert password
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};