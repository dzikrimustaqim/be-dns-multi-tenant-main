'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  // async up({ context: queryInterface }) {
    await queryInterface.bulkInsert('tenants', [
      {
        id: 'e49b6d79-97f3-4edd-a35e-93193711bc05',
        name: 'Darunnajah Pusat',
        schema: 'dn1',
        domain: 'dns1-dev',
        plan: 'premium',
        is_active: true,
        settings: JSON.stringify({
          allowRegistration: true,
          maxUsers: 100
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'f0f3c13a-647e-4789-a6af-b4d8f3843d65',
        name: 'Darunnajah 13',
        schema: 'dn13',
        domain: 'dns13-dev',
        plan: 'basic',
        is_active: true,
        settings: JSON.stringify({
          allowRegistration: false,
          maxUsers: 10
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    
    console.log('Seeded demo tenants in public schema');
  },

  down: async (queryInterface, Sequelize) => {
  //async down({ context: queryInterface }) {
    await queryInterface.bulkDelete('tenants', null, {});
  }
};