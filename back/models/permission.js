"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsTo(models.User, {
        foreignKey: "perm_user"
      });

      Permission.belongsTo(models.Team, {
        foreignKey: "perm_team"
      });
    }
    static LEVELS = {
      ADMIN: 1,
      CONTRIBUTOR: 2,
    };
  }
  Permission.init(
    {
      perm_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      perm_team: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      underscored: true,
    }
  );
  return Permission;
};
