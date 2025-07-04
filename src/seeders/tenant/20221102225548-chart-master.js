'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;

    await queryInterface.bulkInsert({ tableName: 'chart_master', schema: schema }, [
      {
        account_code: 1100,
        account_name: 'Kas IDR',
        account_type: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1101,
        account_name: 'Kas USD',
        account_type: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1110,
        account_name: 'Bank IDR',
        account_type: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1111,
        account_name: 'Bank USD',
        account_type: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1200,
        account_name: 'Piutang Usaha/AR',
        account_type: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1300,
        account_name: 'Aktiva Tetap (Fisik)',
        account_type: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1340,
        account_name: 'Akumulasi Penyusutan Aktiva Tetap (Fisik)',
        account_type: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1350,
        account_name: 'Aktiva Tetap (Non Fisik)',
        account_type: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1390,
        account_name: 'Akumulasi Amortisasi Aktiva Tetap (Non Fisik)',
        account_type: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1410,
        account_name: 'Persediaan - Komponen',
        account_type: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1415,
        account_name: 'Persediaan - Barang Dalam Proses',
        account_type: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1416,
        account_name: 'Persediaan - Barang Diterima',
        account_type: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1420,
        account_name: 'Persediaan - Barang Jadi',
        account_type: 14,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1501,
        account_name: 'Uang Muka',
        account_type: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 1502,
        account_name: 'Investasi',
        account_type: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 2000,
        account_name: 'Pembayaran Pajak',
        account_type: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 2100,
        account_name: 'Utang Usaha/AP',
        account_type: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 2201,
        account_name: 'PPN Penjualan',
        account_type: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 2202,
        account_name: 'PPN Pembelian',
        account_type: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 3100,
        account_name: 'Modal Awal',
        account_type: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 3200,
        account_name: 'Perubahan Modal',
        account_type: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 3400,
        account_name: 'Laba ditahan',
        account_type: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 4100,
        account_name: 'Pendapatan Santri',
        account_type: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 4200,
        account_name: 'Penjualan',
        account_type: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 4300,
        account_name: 'Diskon Penjualan',
        account_type: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 4350,
        account_name: 'Beban Pengiriman dan Pengepakan',
        account_type: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 5101,
        account_name: 'Harga Pokok Penjualan',
        account_type: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 5102,
        account_name: 'Ongkos Produksi',
        account_type: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 5104,
        account_name: 'Penyesuaian Persediaan',
        account_type: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 6100,
        account_name: 'Beban Penjualan',
        account_type: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 6200,
        account_name: 'Administrasi dan Beban Umum',
        account_type: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 6205,
        account_name: 'Beban Penyusutan',
        account_type: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 6206,
        account_name: 'Beban Amortisasi',
        account_type: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 6300,
        account_name: 'Selisih Mata Uang Asing',
        account_type: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 7101,
        account_name: 'Pendapatan Bunga Bank',
        account_type: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 7102,
        account_name: 'Pendapatan Kas',
        account_type: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 7103,
        account_name: 'Diskon Pembelian',
        account_type: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 8101,
        account_name: 'Beban Administrasi Bank',
        account_type: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 8102,
        account_name: 'Beban Bunga Bank',
        account_type: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        account_code: 9990,
        account_name: 'Laba/Rugi Berjalan',
        account_type: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const schema = queryInterface.sequelize.options.dialectOptions.searchPath;
    
    await queryInterface.bulkDelete({ tableName: 'chart_master', schema: schema }, null, {});
  }
};
