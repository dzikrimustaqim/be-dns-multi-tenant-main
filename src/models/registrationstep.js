'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegistrationStep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegistrationStep.init({
    slug: DataTypes.STRING,
    step_name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'registration_step',
    modelName: 'RegistrationStep',
  });
  return RegistrationStep;
};