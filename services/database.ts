import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('database.db');

export const initDatabase = (callback?: (error?: unknown) => void) => {
  try {
    db.execSync(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);'
    );
    if (callback) callback();
  } catch (error) {
    console.error('Error initializing database', error);
    if (callback) callback(error);
  }
};

export const addUser = (
  name: string,
  email: string,
  passwordHash: string,
  callback: (success: boolean, error?: unknown) => void
) => {
  try {
    db.runSync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', name, email, passwordHash);
    callback(true);
  } catch (error) {
    console.error('Error adding user', error);
    callback(false, error);
  }
};

export const findUserByEmail = (
  email: string,
  callback: (user: any | null, error?: unknown) => void
) => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE email = ?', email);
    callback(user || null);
  } catch (error) {
    console.error('Error finding user by email', error);
    callback(null, error);
  }
};

export const findUserByName = (
  name: string,
  callback: (user: any | null, error?: unknown) => void
) => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE name = ?', name);
    callback(user || null);
  } catch (error) {
    console.error('Error finding user by name', error);
    callback(null, error);
  }
};