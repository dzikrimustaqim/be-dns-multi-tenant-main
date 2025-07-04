'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'absensi_kamar_siswa', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      absensi_kamar_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'absensi_kamar', key: 'id' },
        onDelete: 'NO ACTION'
      },
      siswa_id: {
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      absen: {
        type: Sequelize.ENUM("H","A","S","IT","IP"),
        allowNull: true,
      },
      catatan_positif: {
        type: Sequelize.TEXT
      },
      catatan_negatif: {
        type: Sequelize.TEXT
      },
      siswa_status: {
        type: Sequelize.STRING(60)
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
      { tableName: 'absensi_kamar_siswa', schema },
      ['absensi_kamar_id', 'siswa_id'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'absensi_kamar_siswa', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_absensi_kamar_siswa_absen";`
    );
  }
};