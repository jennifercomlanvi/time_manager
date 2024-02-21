'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invitations', {
      inv_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inv_email: {
        type: Sequelize.STRING
      },
      inv_team: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'team_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      inv_token: {
        type: Sequelize.STRING
      },
      inv_status: {
        type: Sequelize.INTEGER
      },
      expired_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invitations');
  }
};