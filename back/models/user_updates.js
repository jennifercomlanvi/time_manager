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
    static getExpiredDate(type) {
      const expirationTimes = {
        [RECOVERY]: 2 * 60 * 60 * 1000, // 2 heures
        [NEW_PASSWORD]: 60 * 60 * 1000, // 1 heures
        [NEW_EMAIL]: 2 * 60 * 60 * 1000, // 2 heures
      };
      const expirationTime = expirationTimes[type] || 30 * 60 * 1000; // Par défaut, 30 minutes
      return new Date(new Date().getTime() + expirationTime);
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
        defaultValue: function () {
          return UserUpdate.getExpiredDate(this.userup_type);
        },
      },
    },
    {
      sequelize,
      modelName: "UserUpdate",
      tableName: "user_updates",
      underscored: true,
      timestamps: true,
    }
  );

  UserUpdate.NEW_PASSWORD = NEW_PASSWORD;
  UserUpdate.NEW_EMAIL = NEW_EMAIL;
  UserUpdate.RECOVERY = RECOVERY;
  return UserUpdate;
};
