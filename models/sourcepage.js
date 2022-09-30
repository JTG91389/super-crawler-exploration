'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sourcePage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.sourcePage.belongsTo(models.source);
      models.sourcePage.belongsTo(models.event);
    }
  }
  sourcePage.init({
    uriPath: DataTypes.STRING,
    sourceId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    htmlRoutePath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sourcePage',
  });
  return sourcePage;
};