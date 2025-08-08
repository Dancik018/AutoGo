import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDatabase = () => {
  if (!db) {
    try {
      db = SQLite.openDatabaseSync('database.db');
      console.log('Database opened successfully');
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  return db;
};

// Function to ensure database is initialized
const ensureDatabaseInitialized = () => {
  try {
    const database = getDatabase();
    // Try a simple query to check if tables exist
    database.getFirstSync('SELECT 1 FROM users LIMIT 1');
    return true;
  } catch (error) {
    console.log('Database not initialized, initializing now...');
    try {
      initDatabase();
      return true;
    } catch (initError) {
      console.error('Failed to initialize database:', initError);
      return false;
    }
  }
};

export const initDatabase = (callback?: (error?: unknown) => void) => {
  try {
    console.log('Initializing database...');
    
    const database = getDatabase();
    
    // Check if tables exist, if not create them
    try {
      // Try to query the users table to see if it exists
      database.getFirstSync('SELECT 1 FROM users LIMIT 1');
      console.log('Tables already exist, skipping creation');
    } catch (error) {
      console.log('Tables do not exist, creating them...');
      
      // Create users table
      database.execSync(
        'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);'
      );
      console.log('Users table created');
      
      // Create favorites table
      database.execSync(
        'CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, car_id INTEGER NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, car_id));'
      );
      console.log('Favorites table created');
    }
    
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
    if (!ensureDatabaseInitialized()) {
      callback(false, new Error('Database not initialized'));
      return;
    }
    const database = getDatabase();
    database.runSync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', name, email, passwordHash);
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
    const database = getDatabase();
    const user = database.getFirstSync('SELECT * FROM users WHERE email = ?', email);
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
    const database = getDatabase();
    const user = database.getFirstSync('SELECT * FROM users WHERE name = ?', name);
    callback(user || null);
  } catch (error) {
    console.error('Error finding user by name', error);
    callback(null, error);
  }
};

export const addFavorite = (
  userId: number,
  carId: number,
  callback: (success: boolean, error?: unknown) => void
) => {
  try {
    const database = getDatabase();
    // Add the favorite (UNIQUE constraint will handle duplicates)
    database.runSync('INSERT INTO favorites (user_id, car_id) VALUES (?, ?)', userId, carId);
    callback(true);
  } catch (error) {
    console.error('Error adding favorite', error);
    // If it's a duplicate, consider it success
    if (error && error.toString().includes('UNIQUE constraint failed')) {
      callback(true);
    } else {
      callback(false, error);
    }
  }
};

export const removeFavorite = (
  userId: number,
  carId: number,
  callback: (success: boolean, error?: unknown) => void
) => {
  try {
    const database = getDatabase();
    // Remove the favorite
    database.runSync('DELETE FROM favorites WHERE user_id = ? AND car_id = ?', userId, carId);
    callback(true);
  } catch (error) {
    console.error('Error removing favorite', error);
    callback(false, error);
  }
};

export const getFavorites = (
  userId: number,
  callback: (favorites: any[], error?: unknown) => void
) => {
  try {
    if (!ensureDatabaseInitialized()) {
      callback([], new Error('Database not initialized'));
      return;
    }
    const database = getDatabase();
    const favorites = database.getAllSync('SELECT car_id FROM favorites WHERE user_id = ?', userId);
    callback(favorites || []);
  } catch (error) {
    console.error('Error getting favorites', error);
    callback([], error);
  }
};

export const isFavorite = (
  userId: number,
  carId: number,
  callback: (isFavorite: boolean, error?: unknown) => void
) => {
  try {
    const database = getDatabase();
    const favorite = database.getFirstSync('SELECT user_id FROM favorites WHERE user_id = ? AND car_id = ?', userId, carId);
    callback(!!favorite);
  } catch (error) {
    console.error('Error checking if favorite', error);
    callback(false, error);
  }
};

// Helper function to check if database is working
export const checkDatabaseHealth = () => {
  try {
    const database = getDatabase();
    const result = database.getFirstSync('SELECT 1 as test') as any;
    return result && result.test === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Function to reset database (for development/testing)
export const resetDatabase = () => {
  try {
    console.log('Resetting database...');
    const database = getDatabase();
    database.execSync('DROP TABLE IF EXISTS favorites');
    database.execSync('DROP TABLE IF EXISTS users');
    console.log('Database reset complete');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};

// Function to get all users (for debugging)
export const getAllUsers = (callback: (users: any[], error?: unknown) => void) => {
  try {
    const database = getDatabase();
    const users = database.getAllSync('SELECT id, name, email FROM users');
    console.log('All users in database:', users);
    callback(users || []);
  } catch (error) {
    console.error('Error getting all users:', error);
    callback([], error);
  }
};