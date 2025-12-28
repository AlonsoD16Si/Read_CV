/**
 * Script para generar hash de contraseña
 * Uso: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'password123';

bcrypt.hash(password, 10).then(hash => {
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
});

