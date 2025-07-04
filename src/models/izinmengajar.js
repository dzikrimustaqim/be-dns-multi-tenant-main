'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IzinMengajar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      IzinMengajar.belongsTo(models.Proguser, { 
        foreignKey: 'guru_id',
        targetKey: 'id', 
        as: 'Guru' 
      });
      IzinMengajar.belongsTo(models.Proguser, { 
        foreignKey: 'guru_pengganti_id',
        targetKey: 'id', 
        as: 'GuruPengganti' 
      });
    }
  }
  IzinMengajar.init({
    guru_id: DataTypes.UUID,
    guru_pengganti_id: DataTypes.UUID,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    kategori: DataTypes.STRING,
    keterangan: DataTypes.STRING,
    kepsek: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'izin_mengajar',
    modelName: 'IzinMengajar',
  });
  return IzinMengajar;
};