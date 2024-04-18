"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      Team.hasMany(models.Permission, {
        foreignKey: "perm_team",
        as: "Permissions",
      });
      Team.belongsToMany(models.User, {
        through: models.Permission,
        foreignKey: "perm_team",
        otherKey: 'perm_user',
        as: 'Users'
      });
    }
  }
  Team.init(
    {
      team_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      team_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Team",
      tableName: "teams",
      underscored: true,
    }
  );
  return Team;
};
