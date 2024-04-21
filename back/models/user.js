"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Constantes pour les états
  const USER_STATES = {
    CREATED: 0,
    ACTIVE: 1,
    BLOCKED: 2,
    DELETED: 3,
  };
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserPassword, { foreignKey: "user_id" });
      User.belongsToMany(models.Team, {
        through: models.Permission,
        foreignKey: "perm_user",
        otherKey: "perm_team",
        as: "Teams",
      });
      User.hasMany(models.Permission, {
        foreignKey: "perm_user",
        as: "Permissions",
      });
      User.hasMany(models.Timer, {
        foreignKey: "timer_user",
        as: "Timers",
      });
      User.hasMany(models.UserControl, { foreignKey: "control_user" });
      User.hasMany(models.UserUpdate, { foreignKey: "userup_user" });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: DataTypes.STRING,
      user_email: DataTypes.STRING,
      user_uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_state: {
        type: DataTypes.INTEGER,
        defaultValue: USER_STATES.CREATED,
      },
      user_description: DataTypes.TEXT,
      user_avatar: DataTypes.STRING,
      user_last_visit: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
    }
  );

  User.USER_STATES = USER_STATES;
  return User;
};
