'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Siswakelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Siswakelas.belongsTo(models.Siswa, { foreignKey: 'siswa_id', targetKey: 'id', as: 'Siswa' });
      Siswakelas.belongsTo(models.TahunAjaran, { foreignKey: 'periode_id', targetKey: 'id', as: 'Periode' });
      Siswakelas.belongsTo(models.Kelas, { foreignKey: 'kelas_id', targetKey: 'id', as: 'Kelas' });
    }
  };
  Siswakelas.init({
    periode_id: DataTypes.INTEGER,
    siswa_id: DataTypes.UUID,
    kelas_id: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'siswakelas',
    modelName: 'Siswakelas',
  });
  return Siswakelas;
};