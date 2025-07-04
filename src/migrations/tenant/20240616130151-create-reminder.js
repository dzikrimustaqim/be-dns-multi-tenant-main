'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'reminder', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tagihan: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: 'tagihan', key: 'id' },
        onDelete: 'NO ACTION'
      },
      tanggal_penjadwalan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      tipe_reminder: {
        allowNull: false,
        defaultValue: "DUE_DATE",
        type: Sequelize.ENUM("DUE_DATE","OVER_DUE","PARTIAL_PAYMENT")
      },
      kanal: {
        allowNull: false,
        defaultValue: "EMAIL",
        type: Sequelize.ENUM("EMAIL","SMS","WHATSAPP")
      },
      terkirim: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    await queryInterface.dropTable({ tableName: 'reminder', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_reminder_tipe_reminder";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_reminder_kanal";`
    );
  }
};