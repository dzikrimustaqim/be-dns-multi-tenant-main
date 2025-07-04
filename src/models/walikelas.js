'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Walikelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Walikelas.belongsTo(models.Proguser, { foreignKey: 'proguser_id', targetKey: 'id', as: 'User' });
      Walikelas.belongsTo(models.TahunAjaran, { foreignKey: 'periode_id', targetKey: 'id', as: 'TahunAjaran' });
      Walikelas.belongsTo(models.Kelas, { foreignKey: 'kelas_id', targetKey: 'id', as: 'Kelas' });
      // Walikelas.belongsToMany(models.CbtSiswa, { through: 'Siswakelas', foreignKey: 'idwalikelas', as: 'CbtSiswa' });
      // Walikelas.hasMany(models.Gurumatapel, { foreignKey: 'idwalikelas', targetKey: 'id', as: 'WalikelasGuru' })
    }
  };
  Walikelas.init({
    periode_id: DataTypes.INTEGER,
    proguser_id: DataTypes.INTEGER,
    kelas_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'walikelas',
    modelName: 'Walikelas',
  });
  return Walikelas;
};