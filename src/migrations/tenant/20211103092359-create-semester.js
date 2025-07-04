'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.sequelize.query(
      `CREATE TYPE "${schema}"."semester_enum" AS ENUM ('MS1','S1','MS2','S2');`
    );

    await queryInterface.createTable(
      { tableName: 'semester', schema }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      periode_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tahun_ajaran', key: 'id' },
        onDelete: 'NO ACTION'
      },
      semester: {
        allowNull: false,
        type: `"${schema}"."semester_enum"`
      },
      semester_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weight: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      masehi_report_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hijriah_report_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_input_nilai_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_input_nilai_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      active: {
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
    await queryInterface.addIndex(
      { tableName: 'semester', schema },
      ['periode_id', 'semester'],
      {
        unique: true
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.dropTable({ tableName: 'semester', schema });
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${schema}"."semester_enum";`);
  }
};