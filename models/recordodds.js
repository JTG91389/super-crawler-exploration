'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recordOdds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recordOdds.belongsTo(models.predicate);
      models.recordOdds.belongsTo(models.record);
      models.recordOdds.belongsTo(models.team);
      models.recordOdds.belongsTo(models.source);
    }
  }
  recordOdds.init({
    predicateId: DataTypes.INTEGER,
    recordId: DataTypes.INTEGER,
    importedOdds: DataTypes.STRING,
    impliedProbability: DataTypes.FLOAT,
    teamId: DataTypes.INTEGER,
    sourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'recordOdds',
  });
  return recordOdds;
};