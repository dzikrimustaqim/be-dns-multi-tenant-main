// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { getModels } = require('../models');

// Memeriksa dan memvalidasi JWT token, lalu melampirkan user dan tenant ke request
exports.authenticate = async (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        schema: decoded.tenantId,
        is_active: true, // Hanya izinkan tenant yang aktif
      },
    });

    if (!tenantInfo) {
      return res.status(401).json({ 
        status: 'error',
        message: `Token salah atau kadaluarsa, Tenant tidak ditemukan atau tidak aktif.` 
      });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please login again.'
      });
    }
    
    next(error);
  }
};

// Memeriksa apakah user memiliki role admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({
    status: 'error',
    message: 'Access denied. Admin privileges required.'
  });
};