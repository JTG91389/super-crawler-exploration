'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.event.belongsToMany(models.source, {through: 'eventSources'});
      models.event.hasMany(models.record);
      models.event.hasMany(models.sourcePage);
    }
  }
  event.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};