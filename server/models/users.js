'use strict';
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    user_uid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    first_name:{
      allowNull: false,
      type: DataTypes.STRING,
    },
    last_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    dob: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    year_of_graduation: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phone_number: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },{});
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsTo(models.Schools, {
      foreignKey: 'user_uid',
    })
  };
  return Users;
};