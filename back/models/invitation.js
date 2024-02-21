"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  
  class Invitation extends Model {
    static INVITATION_STATUS = {
      PENDING: 1,
      ACCEPTED: 2,
      DECLINED: 3,
    };
    static associate(models) {
      Invitation.belongsTo(models.Team, {
        foreignKey: "inv_team",
      });
    }
  }
  Invitation.init(
    {
      inv_email: DataTypes.STRING,
      inv_team: DataTypes.INTEGER,
      inv_token: DataTypes.STRING,
      inv_status: DataTypes.INTEGER,// 1: Envoyé, 2: Accepté, 3: Refusé
      expired_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Invitation",
      underscored: true
    }
  );
  return Invitation;
};
