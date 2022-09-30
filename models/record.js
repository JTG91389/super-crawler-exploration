'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.record.belongsTo(models.event);
      models.record.belongsTo(models.source);
      models.record.hasMany(models.recordOdds)
    }
  }
  record.init({
    eventId: DataTypes.INTEGER,
    recordTimeUTC: DataTypes.DATE,
    sourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'record',
  });
  return record;
};