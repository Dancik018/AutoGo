import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('database.db');

export const initDatabase = () => {
  try {
    db.execSync(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);'
    );
  } catch (error) {
    console.error("Error initializing database", error);
    throw error;
  }
};

export const addUser = (name: string, email: string, passwordHash: string) => {
  try {
    db.runSync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', name, email, passwordHash);
  } catch (error) {
    console.error("Error adding user", error);
    throw error;
  }
};

export const findUserByEmail = (email: string): any | null => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE email = ?', email);
    return user || null;
  } catch (error) {
    console.error("Error finding user by email", error);
    throw error;
  }
};
export const findUserByName = (name: string): any | null => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE name = ?', name);
    return user || null;
  } catch (error) {
    console.error("Error finding user by name", error);
    throw error;
  }
};