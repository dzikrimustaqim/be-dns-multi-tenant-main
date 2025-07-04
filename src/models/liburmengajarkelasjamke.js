'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiburMengajarKelasJamke extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LiburMengajarKelasJamke.init({
    id_libur_mengajar_kelas: DataTypes.UUID,
    jamke: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'libur_mengajar_kelas_jamke',
    modelName: 'LiburMengajarKelasJamke',
  });
  return LiburMengajarKelasJamke;
};