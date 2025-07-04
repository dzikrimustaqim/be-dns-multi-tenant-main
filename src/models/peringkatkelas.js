'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeringkatKelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PeringkatKelas.belongsTo(models.Siswakelas, { foreignKey: 'siswa_kelas_id', targetKey: 'id', as: 'SiswaKelas' });
    }
  };
  PeringkatKelas.init({
    siswa_kelas_id: DataTypes.UUID,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    sequence: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'peringkat_kelas',
    modelName: 'PeringkatKelas',
  });
  return PeringkatKelas;
};