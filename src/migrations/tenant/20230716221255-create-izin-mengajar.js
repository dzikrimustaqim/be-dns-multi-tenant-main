'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'izin_mengajar', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      guru_id: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      guru_pengganti_id: {
        allowNull: true,
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
      },
      start_date: {
        type: Sequelize.DATEONLY
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      kategori: {
        type: Sequelize.STRING(40) // Pribadi,Sakit,Tugas Pondok
      },
      keterangan: {
        type: Sequelize.STRING
      },
      kepsek: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING(20) //P/Y/N 
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
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'izin_mengajar', schema });
  }
};