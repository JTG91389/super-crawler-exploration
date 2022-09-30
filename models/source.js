'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class source extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.source.belongsToMany(models.event, {through: 'eventSources'});
      models.source.hasMany(models.sourcePage);
      models.source.hasMany(models.record);
    }
  }
  source.init({
    routeDomain: DataTypes.STRING,
    displayName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'source',
  });
  return source;
};