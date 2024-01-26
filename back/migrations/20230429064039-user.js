'use strict';
/** @type {import('sequelize-cli').Migration} */

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      comment: "Identifiant unique de l'utilisateur"
    },
    user_name: {
      allowNull: false,
      type: Sequelize.STRING,
      comment:"Nom de l'utilisateur" 
    },
    user_email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      comment: "Adresse e-mail de l'utilisateur"
    },
    user_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
      unique: true,
      comment: "UUID unique de l'utilisateur"
    },
    user_state: {
      allowNull: false,
      type: Sequelize.INTEGER,
      comment: "État du compte"
    },
    user_description: {
      allowNull: true,
      type: Sequelize.TEXT,
      comment: 'Description du profil'
    },
    user_avatar: {
      allowNull: true,
      type: Sequelize.STRING,
      comment: "Avatar de l'utilisateur"
    },
    user_last_visit: {
      allowNull: false,
      type: Sequelize.DATE,
      comment: "Dernière visite"
    },
    created_at:{
      type: Sequelize.DATE,
      comment: "Date de création"
    },
    updated_at:{
      type: Sequelize.DATE,
      comment: "Date de mise a jour"
    }
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}

module.exports = {
  up, down
};
