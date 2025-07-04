'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LiburMengajar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LiburMengajar.hasMany(models.LiburMengajarKelas, { foreignKey: 'id_libur_mengajar', targetKey: 'id', as: 'Kelas' })
    }
  }
  LiburMengajar.init({
    tanggal: DataTypes.DATE,
    id_penginput: DataTypes.UUID,
    keterangan: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'libur_mengajar',
    modelName: 'LiburMengajar',
  });
  return LiburMengajar;
};