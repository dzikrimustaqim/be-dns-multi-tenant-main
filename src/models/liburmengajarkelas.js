'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiburMengajarKelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LiburMengajarKelas.hasMany(models.LiburMengajarKelasJamke, { foreignKey: 'id_libur_mengajar_kelas', targetKey: 'id', as: 'Jamke' })
    }
  }
  LiburMengajarKelas.init({
    id_libur_mengajar: DataTypes.UUID,
    id_kelas: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'libur_mengajar_kelas',
    modelName: 'LiburMengajarKelas',
  });
  return LiburMengajarKelas;
};