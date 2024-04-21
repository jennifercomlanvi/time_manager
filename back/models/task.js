"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, { foreignKey: "task_project" });
      Task.hasMany(models.Timer, {
        foreignKey: "timer_task",
        as: "Timers",
      });
    }
    static STATES = {
      TODO: 1,
      IN_PROGRESS: 2,
      DONE: 3,
    };
  }
  Task.init(
    {
      task_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      task_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      task_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      task_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_project: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
      underscored: true,
    }
  );
  return Task;
};