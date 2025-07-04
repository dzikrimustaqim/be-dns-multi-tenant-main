'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogTagihanSiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LogTagihanSiswa.init({
    id_siswa: DataTypes.UUID,
    id_user: DataTypes.UUID,
    message: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'log_tagihan_siswa',
    modelName: 'LogTagihanSiswa',
  });
  return LogTagihanSiswa;
};