'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeriodeKamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PeriodeKamar.belongsTo(models.Kamar, { foreignKey: 'id_kamar', targetKey: 'id', as: 'Kamar' });
    }
  }
  PeriodeKamar.init({
    id_kamar: DataTypes.INTEGER,
    id_periode: DataTypes.INTEGER,
    kuota: DataTypes.INTEGER,
    id_musyrifah: DataTypes.UUID
  }, {
    sequelize,
    tableName: 'periode_kamar',
    modelName: 'PeriodeKamar',
  });
  return PeriodeKamar;
};