import { Database } from 'sqlite3';

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('good-ol-chat-room.db');

// Create a table if it does not exist
db.serialize(() => {
  // Create the users table if it doesn't exist
  db.run('CREATE TABLE IF NOT EXISTS chatrooms (chatroom TEXT PRIMARY KEY, email TEXT)');
});

export default db;