"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const RECOVERY = 1;
  const NEW_EMAIL = 2;
  const NEW_PASSWORD = 3;
  class UserUpdate extends Model {
    static types = {
      [RECOVERY]: "Récupération de compte",
      [NEW_PASSWORD]: "Changement de mot de passe",
      [NEW_EMAIL]: "Changement de mail",
    };
    static associate(models) {
      UserUpdate.belongsTo(models.User, { foreignKey: "userup_user" });
    }
    static typeToString(type) {
      return this.types[type] || "INCONNU";
    }
  }
  UserUpdate.init(
    {
      userup_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      userup_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
          isIn: [[RECOVERY, NEW_EMAIL, NEW_PASSWORD]],
        },
      },
      userup_otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userup_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      userup_expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserUpdate",
      tableName: "user_updates",
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: (userUpdate, options) => {
          if (!userUpdate.userup_expired_at) {
            userUpdate.userup_expired_at = UserUpdate.getExpiredDate(
              userUpdate.userup_type
            );
          }
        },
      },
    }
  );

  UserUpdate.NEW_PASSWORD = NEW_PASSWORD;
  UserUpdate.NEW_EMAIL = NEW_EMAIL;
  UserUpdate.RECOVERY = RECOVERY;
  UserUpdate.getExpiredDate = function (type) {
    const expirationTimes = {
      [UserUpdate.RECOVERY]: 2 * 60 * 60 * 1000, // 2 heures
      [UserUpdate.NEW_PASSWORD]: 60 * 60 * 1000, // 1 heure
      [UserUpdate.NEW_EMAIL]: 2 * 60 * 60 * 1000, // 2 heures
    };
    const expirationTime = expirationTimes[type] || 30 * 60 * 1000; // Par défaut, 30 minutes
    return new Date(Date.now() + expirationTime);
  };
  return UserUpdate;
};
