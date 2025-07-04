// src/middlewares/tenantHandler.js
const { getModels, createConnection } = require('../models'); // Menggunakan getModels dari src/models/index.js

/**
 * Middleware untuk mengidentifikasi tenant berdasarkan header 'x-tenant-domain',
 * memvalidasinya terhadap data di skema public, dan menyiapkan koneksi serta model.
 * Menyimpan objek `db` (berisi models dan instance sequelize) pada `req.tenantDb`.
 * Menyimpan informasi tenant pada `req.tenantInfo` dan schema name pada `req.tenantId`.
 */
const tenantHandler = async (req, res, next) => {
  const tenantDomain = req.headers['x-tenant-domain'];

  if (!tenantDomain) {
    return res.status(400).json({ 
      message: "Header 'x-tenant-domain' wajib diisi." 
    });
  }

  try {
    // 1. Dapatkan model dari skema 'public' untuk mengakses tabel 'Tenants'
    const publicDbModels = getModels('public');
    if (!publicDbModels.Tenant) {
      // Ini seharusnya tidak terjadi jika model Tenant.js ada dan benar
      console.error("Model 'Tenant' tidak ditemukan di skema public. Pastikan src/models/tenant.js ada.");
      return res.status(500).json({ message: "Konfigurasi server error: Model Tenant tidak ditemukan." });
    }
    
    // 2. Cari tenant berdasarkan domain yang diberikan dan pastikan aktif
    const tenantInfo = await publicDbModels.Tenant.findOne({
      where: {
        domain: tenantDomain,
        is_active: true, // Hanya izinkan tenant yang aktif
      },
    });

    if (!tenantInfo) {
      console.warn(`Tenant tidak ditemukan atau tidak aktif untuk domain: ${tenantDomain}`);
      return res.status(404).json({ 
        message: `Tenant untuk domain '${tenantDomain}' tidak ditemukan atau tidak aktif.` 
      });
    }

    // 3. Dapatkan nama skema database dari informasi tenant
    const tenantSchemaName = tenantInfo.schema;
    if (!tenantSchemaName) {
        console.error(`Tenant dengan domain '${tenantDomain}' tidak memiliki schemaName yang valid.`);
        return res.status(500).json({ message: "Konfigurasi tenant error: schemaName tidak valid." });
    }

    // 4. Simpan informasi tenant dan schemaName (sebagai tenantId) di request
    req.tenantId = tenantSchemaName; // tenantId sekarang adalah nama skema (e.g., 'tenant_alpha_schema')
    req.tenantInfo = tenantInfo.toJSON(); // Simpan seluruh info tenant jika diperlukan di controller

    // 5. Dapatkan semua model yang sudah diinisialisasi untuk skema tenant ini
    const tenantSpecificModels = getModels(tenantSchemaName);
    
    // 6. Dapatkan instance Sequelize untuk tenant ini
    const tenantSpecificSequelize = createConnection(tenantSchemaName); // Ini juga akan di-cache

    // 7. Lampirkan model dan instance Sequelize ke objek request
    req.db = {
      ...tenantSpecificModels,
      sequelize: tenantSpecificSequelize,
      Sequelize: tenantSpecificModels.Sequelize, // Kelas Sequelize jika diperlukan
    };
    
    next();

  } catch (error) {
    console.error(`Error saat memproses tenant dengan domain ${tenantDomain}:`, error);
    // Tangani error spesifik dari Sequelize jika perlu
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeHostNotFoundError') {
        return res.status(503).json({ message: "Tidak dapat terhubung ke database tenant.", error: error.message });
    }
    return res.status(500).json({ message: "Gagal memproses request tenant.", error: error.message });
  }
};

module.exports = tenantHandler;