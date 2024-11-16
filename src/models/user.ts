import { getDB } from '../db/init'; // Import the database connection function



export const getUserByUsername = async (username: string): Promise<any> => {
  const db = getDB(); // Get the database instance
  return await db.get("SELECT * FROM users WHERE username = ?", [username]);
};

export const getLastLogin = async (username: string): Promise<any> => {
  const db = getDB(); // Get the database instance
  return await db.get("SELECT last_login FROM users WHERE username = ?", [username]);
};

export const createUser = async (
  username: string,
  password: string
): Promise<void> => {
  const db = getDB(); // Get the database instance
  await db.run(
    "INSERT INTO users (username, password, last_login) VALUES (?, ?, ?)",
    [username, password, new Date().toLocaleString()]
  );
};

export const updateUserLogin = async (username: string): Promise<void> => {
  const db = getDB(); // Get the database instance
  await db.run(
    "UPDATE users SET last_login = ? WHERE username = ?",
    [new Date().toLocaleString(), username]
  );
};

export const updatePassword = async (
  username: string,
  newPassword: string
): Promise<void> => {
  const db = getDB(); // Get the database instance
  await db.run("UPDATE users SET password = ? WHERE username = ?", [
    newPassword,
    username,
  ]);
};

export const deleteUser = async (username: string): Promise<void> => {
  const db = getDB(); // Get the database instance
  await db.run("DELETE FROM users WHERE username = ?", [username]);
};

export const getAllUsers = async (): Promise<any[]> => {
  const db = getDB(); // Get the database instance
  return await db.all("SELECT id, username FROM users WHERE role = 'USER'");
};

export const resetPassword = async (username: string): Promise<void> => {
  const db = getDB(); // Get the database instance
  await db.run("UPDATE users SET password = '' WHERE username = ?", [username]);
};