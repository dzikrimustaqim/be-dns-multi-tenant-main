'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'hasil_ppsb', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_siswa: {
        type: Sequelize.UUID,
        unique: true,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_penguji: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_user_input: {
        type: Sequelize.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'SET NULL'
      },
      status_kelulusan: {
        type: Sequelize.ENUM("lulus_murni","lulus_bersyarat","lulus_cabang","lulus_tidak_mendapat_tempat","lulus_cadangan","tidak_lulus","menunggu_ujian")
      },
      id_lembaga: {
        type: Sequelize.INTEGER
      },
      id_tingkat: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tingkat', key: 'id' },
        onDelete: 'SET NULL'
      },
      id_lembaga_biaya: {
        type: Sequelize.INTEGER
      },
      id_paket_biaya: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'paket_pembayaran', key: 'id' },
        onDelete: 'SET NULL'
      },
      id_tagihan: {
        type: Sequelize.UUID,
        references: { model: 'tagihan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_gelombang: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'gelombang_pendaftaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      catatan_penguji: {
        type: Sequelize.TEXT
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

    await queryInterface.dropTable({ tableName: 'hasil_ppsb', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_hasil_ppsb_status_kelulusan";`
    );
  }
};