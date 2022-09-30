'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.team.belongsTo(models.event);
      models.team.hasMany(models.recordOdds)
    }
  }
  team.init({
    eventId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    nameAlts: DataTypes.STRING(2000)
  }, {
    sequelize,
    modelName: 'team',
  });
  return team;
};