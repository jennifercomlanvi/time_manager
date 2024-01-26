'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPassword extends Model {
    static associate(models) {
      UserPassword.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  UserPassword.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserPassword',
    tableName: 'user_passwords',
    underscored: true
  });
  return UserPassword;
};
