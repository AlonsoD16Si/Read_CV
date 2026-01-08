/**
 * Script to configure PostgreSQL in .env.local
 * Run with: node scripts/configure-postgres.js
 */

const fs = require("fs");
const path = require("path");

const envLocalPath = path.join(process.cwd(), ".env.local");
const envPath = path.join(process.cwd(), ".env");

// Check which file exists
let envFile = null;
if (fs.existsSync(envLocalPath)) {
  envFile = envLocalPath;
} else if (fs.existsSync(envPath)) {
  envFile = envPath;
} else {
  console.log("❌ No se encontró .env.local ni .env");
  console.log("💡 Creando .env.local...");
  envFile = envLocalPath;
}

// Read existing content
let content = "";
if (fs.existsSync(envFile)) {
  content = fs.readFileSync(envFile, "utf8");
}

// Parse existing variables
const lines = content.split("\n");
const vars = {};
lines.forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      vars[key.trim()] = valueParts.join("=").trim();
    }
  }
});

// Update configuration
vars.USE_MOCK_DB = "false";

// Check if DATABASE_URL is set
if (!vars.DATABASE_URL) {
  console.log("⚠️  DATABASE_URL no está configurado");
  console.log("💡 Por favor, agrega tu DATABASE_URL al archivo .env.local");
  console.log("   Ejemplo: DATABASE_URL=\"postgresql://user:password@localhost:5432/nexary_cv?schema=public\"");
}

// Write updated content
const newLines = [];
const existingKeys = new Set();

// Add existing variables (except USE_MOCK_DB)
lines.forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key] = trimmed.split("=");
    if (key && key.trim() !== "USE_MOCK_DB") {
      newLines.push(line);
      existingKeys.add(key.trim());
    } else if (trimmed.startsWith("#")) {
      newLines.push(line);
    }
  } else {
    newLines.push(line);
  }
});

// Add USE_MOCK_DB if not already added
if (!existingKeys.has("USE_MOCK_DB")) {
  newLines.push("USE_MOCK_DB=false");
}

// Add DATABASE_URL placeholder if not exists
if (!vars.DATABASE_URL && !existingKeys.has("DATABASE_URL")) {
  newLines.push("");
  newLines.push("# Database - PostgreSQL");
  newLines.push("# DATABASE_URL=\"postgresql://user:password@localhost:5432/nexary_cv?schema=public\"");
}

const newContent = newLines.join("\n");

fs.writeFileSync(envFile, newContent, "utf8");

console.log(`✅ Archivo ${path.basename(envFile)} actualizado:`);
console.log(`   USE_MOCK_DB=false`);

if (!vars.DATABASE_URL) {
  console.log("");
  console.log("⚠️  IMPORTANTE: Agrega tu DATABASE_URL al archivo");
  console.log(`   Edita: ${envFile}`);
  console.log("   Agrega: DATABASE_URL=\"postgresql://user:password@localhost:5432/nexary_cv?schema=public\"");
} else {
  console.log(`   DATABASE_URL: ✅ Configurado`);
}

console.log("");
console.log("🔄 Reinicia el servidor de desarrollo para aplicar los cambios:");
console.log("   npm run dev");

