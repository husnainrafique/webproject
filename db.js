const sqlite3 = require('sqlite3').verbose(); // Make sure this is correct
const path = require('path');

// Your database path setup
const dbPath = path.join(__dirname, 'my_database.db');

// Database connection and utilities
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Utility functions
function executeScript(scriptPath) {
  const fs = require('fs');
  const script = fs.readFileSync(scriptPath, 'utf-8');
  return new Promise((resolve, reject) => {
    db.exec(script, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  executeScript,
  runQuery,
};
