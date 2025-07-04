'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kepsek extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kepsek.belongsTo(models.TahunAjaran, { 
        foreignKey: 'id_tahun_ajaran',
        targetKey: 'id', 
        as: 'TahunAjaran' 
      });

      // Kepsek.belongsTo(models.Proguser, { 
      //   foreignKey: 'id_direktur',
      //   targetKey: 'id', 
      //   as: 'Direktur' 
      // });

      Kepsek.belongsTo(models.Proguser, { 
        foreignKey: 'id_user',
        targetKey: 'id', 
        as: 'Proguser' 
      });
    }
  }
  Kepsek.init({
    id_tahun_ajaran: DataTypes.INTEGER,
    tipe: DataTypes.ENUM("KEPSEK","WK_KEPSEK","DIREKTUR","WK_DIREKTUR"),
    id_user: DataTypes.UUID,
    deskripsi: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'kepsek',
    modelName: 'Kepsek',
  });
  return Kepsek;
};