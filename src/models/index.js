// src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize'); // Impor DataTypes
const { createConnection } = require('../config/database');

// Cache untuk model yang sudah diinisialisasi per tenant
// Struktur: Map<tenantId, { modelName: Model, ... }>
const tenantModelsCache = new Map();

/**
 * Menginisialisasi dan mengembalikan semua model untuk tenantId yang diberikan.
 * Model-model akan di-cache untuk penggunaan berikutnya.
 * @param {string} tenantId - ID tenant.
 * @returns {object} - Objek yang berisi semua model yang telah diinisialisasi untuk tenant tersebut.
 */
const getModels = (tenantId) => {
  if (tenantModelsCache.has(tenantId)) {
    return tenantModelsCache.get(tenantId);
  }

  const sequelize = createConnection(tenantId);
  const db = {};

  // Baca semua file model dari direktori ini (kecuali index.js dan file non-js)
  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== path.basename(__filename) && // Jangan impor diri sendiri
        file.slice(-3) === '.js' &&
        !file.endsWith('.test.js') // Abaikan file test jika ada
      );
    })
    .forEach(file => {
      // Di sini kita menggunakan require untuk mendapatkan fungsi definisi model
      // Setiap file model harus mengekspor fungsi yang menerima (sequelize, DataTypes)
      const modelDefinition = require(path.join(__dirname, file));
      // Panggil fungsi definisi model dengan instance sequelize tenant dan DataTypes
      const model = modelDefinition(sequelize, DataTypes);
      db[model.name] = model;
    });

  // Membuat asosiasi antar model jika ada
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize; // Instance Sequelize tenant
  db.Sequelize = Sequelize; // Kelas Sequelize itu sendiri

  tenantModelsCache.set(tenantId, db);
  return db;
};

// Fungsi untuk mendapatkan model spesifik untuk tenant tertentu
const getModel = (tenantId, modelName) => {
  const models = getModels(tenantId);
  if (!models[modelName]) {
    throw new Error(`Model ${modelName} tidak ditemukan untuk tenant ${tenantId}`);
  }
  return models[modelName];
};

module.exports = {
  getModels,
  getModel,
  // Ekspor juga createConnection jika perlu diakses langsung dari tempat lain,
  // meskipun umumnya lebih baik melalui getModels atau getModel.
  createConnection 
};