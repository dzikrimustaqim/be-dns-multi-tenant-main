'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rayon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rayon.belongsTo(models.Proguser, { 
        foreignKey: 'id_murobbi',
        targetKey: 'id', 
        as: 'ProguserRayon' 
      });

      Rayon.belongsTo(models.Gedung, { 
        foreignKey: 'id_gedung',
        targetKey: 'id', 
        as: 'Gedung' 
      });

      Rayon.hasMany(models.Kamar, { foreignKey: 'id_rayon', targetKey: 'id', as: 'RayonKamar' })

    }
  }
  Rayon.init({
    id_gedung: DataTypes.INTEGER,
    nama_rayon: DataTypes.STRING,
    id_murobbi: DataTypes.UUID,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'rayon',
    modelName: 'Rayon',
  });
  return Rayon;
};