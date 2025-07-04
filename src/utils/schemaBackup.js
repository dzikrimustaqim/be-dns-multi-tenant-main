// src/utils/schemaBackup.js

const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const fs = require('fs').promises;
const path = require('path');

/**
 * Backup schema database ke file SQL
 * @param {string} schemaName - Nama schema untuk di-backup
 * @returns {Promise<string>} - Path file backup
 */
async function backupSchema(schemaName) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../backups');
    const backupFile = path.join(backupDir, `${schemaName}_${timestamp}.sql`);
    
    // Pastikan direktori backup ada
    await fs.mkdir(backupDir, { recursive: true });
    
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    
    // Jalankan pg_dump untuk backup schema
    const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -n ${schemaName} -f ${backupFile}`;
    
    await execPromise(command);
    console.log(`Schema ${schemaName} backed up to ${backupFile}`);
    
    return backupFile;
  } catch (error) {
    console.error(`Error backing up schema ${schemaName}:`, error);
    throw error;
  }
}

/**
 * Restore schema dari file backup
 * @param {string} backupFile - Path file backup
 * @returns {Promise<boolean>} - true jika berhasil
 */
async function restoreSchema(backupFile) {
  try {
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    
    // Jalankan psql untuk restore schema
    const command = `PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${backupFile}`;
    
    await execPromise(command);
    console.log(`Restored schema from ${backupFile}`);
    
    return true;
  } catch (error) {
    console.error(`Error restoring schema from ${backupFile}:`, error);
    throw error;
  }
}

module.exports = {
  backupSchema,
  restoreSchema
};