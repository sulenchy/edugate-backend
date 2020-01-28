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
    email: {
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
    },
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    isVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },{});
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsTo(models.Schools, {
      foreignKey: 'school_uid',
    }),
    Users.hasMany(models.Results, {
      foreignKey: 'user_uid',
      onDelete: 'CASCADE'
    })
  };
  return Users;
};
