'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gurustudi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gurustudi.belongsTo(models.Proguser, { foreignKey: 'proguser_id', targetKey: 'id', as: 'User' });
      Gurustudi.belongsTo(models.Walikelas, { foreignKey: 'walikelas_id', targetKey: 'id', as: 'Walikelas' });
      Gurustudi.belongsTo(models.Studi, { foreignKey: 'studi_id', targetKey: 'id', as: 'Studi' });
    }
  };
  Gurustudi.init({
    proguser_id: DataTypes.UUID,
    walikelas_id: DataTypes.UUID,
    studi_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'gurustudi',
    modelName: 'Gurustudi',
  });
  return Gurustudi;
};