'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'nilai_ujian_ppsb', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_hasil_ppsb: {
        type: Sequelize.UUID,
        references: { model: 'hasil_ppsb', key: 'id' },
        onDelete: 'NO ACTION'
      },
      id_matapel_uji: {
        type: Sequelize.INTEGER,
        references: { model: 'matapel_uji', key: 'id' },
        onDelete: 'NO ACTION'
      },
      nilai: {
        type: Sequelize.NUMERIC(5,2)
      },
      keterangan: {
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
    
    await queryInterface.addIndex(
      { tableName: 'nilai_ujian_ppsb', schema },
      ['id_hasil_ppsb', 'id_matapel_uji'],
      {
        unique: true
      }
    );
  },
  async down(queryInterface, Sequelize) {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'nilai_ujian_ppsb', schema });
  }
};