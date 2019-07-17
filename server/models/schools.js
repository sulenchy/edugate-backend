'use strict';
export default (sequelize, DataTypes) => {
  const Schools = sequelize.define('Schools', {
    school_uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    school_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_uid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
    },
    address_line_1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address_line_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  Schools.associate = function (models) {
    // associations can be defined here
    Schools.hasMany(models.Users, {
      foreignKey: 'school_uid',
      onDelete: 'CASCADE'
    }),
      Schools.hasMany(models.Results, {
        foreignKey: 'school_uid',
        onDelete: 'CASCADE'
      })
  };
  return Schools;
};