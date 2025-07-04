'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FixedVirtualAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FixedVirtualAccount.init({
    id_siswa: DataTypes.UUID,
    id_provider: DataTypes.UUID,
    id_group_biaya: DataTypes.INTEGER,
    nomor_va: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'fixed_virtual_account',
    modelName: 'FixedVirtualAccount',
  });
  return FixedVirtualAccount;
};