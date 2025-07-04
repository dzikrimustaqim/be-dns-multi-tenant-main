'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'va_group_biaya', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_group_biaya: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'group_biaya', key: 'id' },
        onDelete: 'NO ACTION'
      },
      prefix: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });

    await queryInterface.addIndex(
      { tableName: 'va_group_biaya', schema },
      ['id_group_biaya','prefix'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'va_group_biaya', schema });
  }
};