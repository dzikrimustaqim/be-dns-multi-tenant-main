'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Semester.belongsTo(models.TahunAjaran, { 
        foreignKey: 'periode_id',
        targetKey: 'id', 
        as: 'Periode' 
      });
    }
  };
  Semester.init({
    periode_id: DataTypes.INTEGER,
    semester: DataTypes.ENUM("MS1","S1","MS2","S2"),
    semester_name: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    masehi_report_date: DataTypes.STRING,
    hijriah_report_date: DataTypes.STRING,
    start_input_nilai_date: DataTypes.DATE,
    end_input_nilai_date: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'semester',
    modelName: 'Semester',
  });
  return Semester;
};