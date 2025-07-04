'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'damage', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      kategori: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ruangan: {
        type: Sequelize.STRING
      },
      kelas: {
        type: Sequelize.STRING
      },
      alat_id: {
        type: Sequelize.INTEGER,
        references: { model: 'alat', key: 'id' },
        onDelete: 'NO ACTION'
      },
      detail: {
        type: Sequelize.TEXT
      },
      priority: {
        type: Sequelize.ENUM('Low','Medium','High')
      },
      status: {
        type: Sequelize.ENUM('OPEN','IN PROGRESS','CLOSE')
      },
      proguser_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
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
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.dropTable({ tableName: 'damage', schema });
  }
};