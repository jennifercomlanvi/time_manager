'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    static associate(models) {
      UserToken.belongsTo(models.User,{foreignKey: 'user_id'});
    }
  }
  UserToken.init({
    token: DataTypes.UUID,
    user_id: DataTypes.INTEGER,
    expired_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'UserToken',
    tableName: 'user_tokens',
    underscored: true
  });
  return UserToken;
};
