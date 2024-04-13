'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const CTRL_REGISTER = 1;
  const CTRL_EMAIL_CHECK = 2;
  const CTRL_DELETE = 3;
  const CTRL_PASSWORD = 4;
  class UserControl extends Model {
  static types = {
    [CTRL_REGISTER]: "Enregistrement",
    [CTRL_DELETE]: "Suppression du compte",
    [CTRL_EMAIL_CHECK]: "Changement de mail",
    [CTRL_PASSWORD]: "Changement de mot de passe",
  };
    static associate(models) {
      UserControl.belongsTo(models.User, { foreignKey: 'control_user' });
    }
    static typeToString(type) {
      return types[type] || 'INCONNU';
    }
  }
  UserControl.init({
    control_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    control_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    control_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [
          [
            CTRL_REGISTER,
            CTRL_EMAIL_CHECK,
            CTRL_DELETE,
            CTRL_PASSWORD
          ],
        ],
      },
    },
    control_otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    control_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    control_expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserControl',
    tableName: 'user_controls',
    underscored: true,
    timestamps: true,
  });

  UserControl.CTRL_DELETE = CTRL_DELETE;
  UserControl.CTRL_EMAIL_CHECK = CTRL_EMAIL_CHECK;
  UserControl.CTRL_REGISTER = CTRL_REGISTER;
  UserControl.CTRL_PASSWORD = CTRL_PASSWORD;
  return UserControl;
};
