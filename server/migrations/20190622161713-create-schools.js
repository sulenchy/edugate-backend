'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schools', {
      school_uid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      school_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      admin_uid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      address_line_1: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address_line_2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      postal_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schools');
  }
};