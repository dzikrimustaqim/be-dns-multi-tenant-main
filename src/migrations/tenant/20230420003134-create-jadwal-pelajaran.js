'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.createTable({ tableName: 'jadwal_pelajaran', schema }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      semester: {
        allowNull: false,
        type: `"${schema}"."semester_enum"`
      },
      kelas_id: {
        type: Sequelize.INTEGER,
        references: { model: 'kelas', key: 'id' },
        onDelete: 'NO ACTION'
      },
      day: {
        allowNull: false,
        type: Sequelize.ENUM("Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday")
      },
      jamke: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      studi_id: {
        type: Sequelize.INTEGER,
        references: { model: 'studi', key: 'id' },
        onDelete: 'NO ACTION'
      },
      guru_id: {
        type: Sequelize.DataTypes.UUID,
        references: { model: 'proguser', key: 'id' },
        onDelete: 'NO ACTION'
      },
      asc_guru_id: {
        allowNull: false,
        type: Sequelize.STRING(40)
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
      { tableName: 'jadwal_pelajaran', schema },
      ['id_tahun_ajaran', 'semester', 'kelas_id', 'studi_id', 'day', 'jamke'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'jadwal_pelajaran', schema });
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "${schema}"."enum_jadwal_pelajaran_day";`
    );
  }
};