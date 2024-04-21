"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Timer extends Model {
    static associate(models) {
      Timer.belongsTo(models.Task, { foreignKey: "timer_task" });
      Timer.belongsTo(models.User, { foreignKey: "timer_user" });
      Timer.belongsTo(models.Project, { foreignKey: "timer_project" });
    }
  }
  Timer.init(
    {
      timer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      timer_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timer_end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      timer_task: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timer_project: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timer_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timer_duration: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Timer",
      tableName: "timers",
      underscored: true,
    }
  );
  return Timer;
};
