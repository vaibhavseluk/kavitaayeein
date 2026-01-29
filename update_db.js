const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Find the database file
const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const files = fs.readdirSync(d1Dir).filter(f => f.endsWith('.sqlite'));

if (files.length === 0) {
  console.error('No database file found!');
  process.exit(1);
}

const dbPath = path.join(d1Dir, files[0]);
console.log(`Using database: ${dbPath}`);

const db = new Database(dbPath);

// Update admin role
console.log("\nUpdating sh%admin to admin role...");
const updateResult = db.prepare("UPDATE users SET role = 'admin' WHERE username = 'sh%admin'").run();
console.log(`Updated ${updateResult.changes} row(s)`);

// Verify users
console.log("\nVerifying all sh% users:");
const users = db.prepare("SELECT id, username, email, role FROM users WHERE username LIKE 'sh%'").all();
console.table(users);

db.close();
console.log("\n✅ Admin role updated successfully!");
