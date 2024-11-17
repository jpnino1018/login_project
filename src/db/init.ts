import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { hashPassword } from '../utils/password';

let db: Database<sqlite3.Database, sqlite3.Statement>;

// Async function to connect to the database
export const connectDB = async (): Promise<void> => {
  try {
    // Open the database connection
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });

    // Create users table if it does not exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('ADMIN', 'USER')) DEFAULT 'USER',
        last_login TEXT
      )
    `);

    
    await db.run("INSERT OR IGNORE INTO users (username, password, role, last_login) VALUES ('soyadmin', ?, 'ADMIN', '2024-11-16T00:00:00Z')", [hashPassword("password")]);

    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; // Rethrow error to be caught in app.ts
  }
};

// Helper function to get the db instance
export const getDB = (): Database<sqlite3.Database, sqlite3.Statement> => {
  if (!db) {
    throw new Error('Database not connected!');
  }
  return db;
};
