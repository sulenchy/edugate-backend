'use strict';
export default (sequelize, DataTypes) => {
  const Results = sequelize.define('Results', {
    result_uid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    year: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    term: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    subject: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    exam: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    mark: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    grade: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {});
  Results.associate = function(models) {
    // associations can be defined here
    Results.belongsTo(models.Schools, {
      foreignKey: 'school_uid',
      onDelete: 'CASCADE'
    },
    Results.belongsTo(models.Users, {
      foreignKey: 'user_uid',
      onDelete: 'CASCADE'
    })
  };
  return Results;
};