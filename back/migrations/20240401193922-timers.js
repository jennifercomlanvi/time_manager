"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("timers", {
      timer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      timer_project: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "projects",
          key: "project_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      timer_task: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tasks",
          key: "task_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      timer_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      timer_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      timer_end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      timer_duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("timers");
  },
};
