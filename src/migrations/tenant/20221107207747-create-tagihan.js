'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'tagihan', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_siswa: {
        type: Sequelize.UUID,
        references: { model: 'siswa', key: 'id' },
        onDelete: 'NO ACTION'
      },
      nomor: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      tanggal_tagihan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      tanggal_jatuh_tempo: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      nilai_tagihan: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.NUMERIC(10,2)
      },
      status_pembayaran: {
        allowNull: false,
        defaultValue: "BELUM_DIBAYAR",
        type: Sequelize.ENUM("LUNAS","DIBAYAR_SEBAGIAN","BELUM_DIBAYAR","TELAT")
      },      
      keterangan: {
        type: Sequelize.STRING
      },
      bulan_tagihan: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      tahun_tagihan: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      status_tagihan: {
        allowNull: false,
        defaultValue: "AKTIF",
        type: Sequelize.ENUM("AKTIF","NONAKTIF")
      },      
      status_notifikasi: {
        allowNull: false,
        defaultValue: "BELUM_TERKIRIM",
        type: Sequelize.ENUM("BELUM_TERKIRIM","SUDAH_TERKIRIM")
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

    await queryInterface.dropTable({ tableName: 'tagihan', schema });    
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_tagihan_status_tagihan";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_tagihan_status_pembayaran";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_tagihan_status_notifikasi";`
    );
  }
};