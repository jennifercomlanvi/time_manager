'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
        Team.hasMany(models.Permission);
    }
  }
  Team.init({
    team_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    underscored: true,
  });
  return Team;
};

