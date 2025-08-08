'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userID: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      googleID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      githubID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isSubscribed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      nextSubscription: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      subscriptionTxRef: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('posts', {
      postID: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      userID: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userID',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attachment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('comments', {
        commentID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        postID: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'posts',
            key: 'postID',
          },
          onDelete: 'CASCADE',
        },
        userID: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'users',
            key: 'userID',
          },
        },
        body: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('users');
  },
};