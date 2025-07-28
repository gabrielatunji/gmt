'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'id', {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
       allowNull: false
    });

  }
}
//   async down(queryInterface, Sequelize) {
//   //   await queryInterface.changeColumn('users', 'paymentStatus', {
//   //     type: Sequelize.ENUM,
//   //     allowNull: false,
//   //     values: ['Not Paid', 'Initiated', 'Paid'],
//   //     defaultValue: 'Not Paid'
//   //   });
//   // }
// };