"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.Team, { foreignKey: "project_team" });
      Project.hasMany(models.Task, {
        foreignKey: "task_project",
        as: "Tasks",
      });
      Project.hasMany(models.Timer, {
        foreignKey: "timer_project",
        as: "Timers",
      });
    }
  }
  Project.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      project_team: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      underscored: true,
    }
  );
  return Project;
};
