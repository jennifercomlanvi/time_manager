'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  // Constantes pour les états
  const USER_STATES = {
    ACTIVE: 0,
    BLOCKED: 1,
    DELETED: 2,
  };
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserPassword, { foreignKey: 'user_id' });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_state:{
      type: DataTypes.INTEGER,
      defaultValue:USER_STATES.ACTIVE,
    },
    user_description:DataTypes.TEXT,
    user_avatar:DataTypes.STRING,
    user_last_visit:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
  });

  User.USER_STATES = USER_STATES;
  return User;
};
