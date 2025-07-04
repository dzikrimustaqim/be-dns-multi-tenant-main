'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    const functionSQL = `
      CREATE OR REPLACE FUNCTION ${schema}.update_biaya_tahunan()
      RETURNS TRIGGER
      AS $$
      DECLARE
        idbiayatahunan integer;
      BEGIN
        IF (TG_OP = 'INSERT') THEN
          idbiayatahunan = NEW.id_biaya_tahunan;
        ELSE
          idbiayatahunan = OLD.id_biaya_tahunan;
        END IF;

        RAISE NOTICE 'idbiayatahunan = %', idbiayatahunan;

        UPDATE ${schema}.biaya_tahunan s 
        SET total_biaya = (
          SELECT SUM(nilai_biaya) 
          FROM ${schema}.item_biaya_tahunan a 
          INNER JOIN ${schema}.biaya_tahunan b 
          ON a.id_biaya_tahunan = b.id 
          WHERE b.id = idbiayatahunan
        )
        WHERE s.id = idbiayatahunan;

        RETURN NULL;
      END
      $$ LANGUAGE plpgsql;
    `;

    const triggerSQL = `
      CREATE TRIGGER calculate_biaya_tahunan
      AFTER INSERT OR UPDATE OR DELETE ON ${schema}.item_biaya_tahunan
      FOR EACH ROW EXECUTE FUNCTION ${schema}.update_biaya_tahunan();
    `;

    await queryInterface.sequelize.query(functionSQL);
    await queryInterface.sequelize.query(triggerSQL);
  },

  down: async (queryInterface, Sequelize) => {
    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS calculate_biaya_tahunan ON ${schema}.item_biaya_tahunan`);
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS ${schema}.update_biaya_tahunan()`);
  }
};
