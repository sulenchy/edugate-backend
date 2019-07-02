'use strict';
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    user_uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    first_name:{
      allowNull: true,
      type: DataTypes.STRING,
    },
    last_name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    dob: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    year_of_graduation: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    phone_number: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  },{});
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsTo(models.Schools, {
      foreignKey: 'school_uid',
    })
  };
  return Users;
};
