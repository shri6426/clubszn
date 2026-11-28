const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize database schema
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      provider TEXT DEFAULT 'email',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      date TEXT,
      time TEXT,
      venue TEXT,
      location TEXT,
      price REAL DEFAULT 0,
      price_type TEXT DEFAULT 'FREE',
      description TEXT,
      full_description TEXT,
      highlights TEXT,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      event_id TEXT,
      event_title TEXT NOT NULL,
      event_date TEXT,
      event_time TEXT,
      event_venue TEXT,
      ticket_tier TEXT NOT NULL,
      ticket_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      attendee_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      total REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'free',
      stripe_payment_intent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Seed default admin user (clubszn.faq@gmail.com / admin123)
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('clubszn.faq@gmail.com');
  if (!existingAdmin) {
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, provider, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin-default',
      'clubszn.faq@gmail.com',
      adminHash,
      'SZN Admin',
      'admin',
      'email',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
    );
    console.log('✅ Default Admin account initialized: clubszn.faq@gmail.com / admin123');
  }

  // Seed primary event: TURF SZN in Chennai
  const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get('turf-szn-01');
  if (!existingEvent) {
    const highlights = JSON.stringify([
      'Floodlit evening arena takeover',
      'Social Football & Box Cricket matches',
      'Group challenges & open games',
      'Live DJ sets & curated soundscape',
      'Sideline hangout zones & refreshments',
      'Exclusive SZN turf jersey drops & photo coverage',
    ]);

    db.prepare(`
      INSERT INTO events (id, slug, title, category, date, time, venue, location, price, price_type, description, full_description, highlights, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'turf-szn-01',
      'turf-szn',
      'TURF SZN',
      'GAMES',
      'DATES ANNOUNCING SOON',
      'EVENING — TIME TBA',
      'TURF ARENA — REVEALING SOON',
      'Chennai, India',
      0,
      'FREE',
      'The premier turf edition of Club SZN. Social football, box cricket, turf challenges, DJ sets and electric floodlit energy.',
      `CLUB SZN IS TAKING OVER THE TURF.

Get ready for an electric evening under the stadium floodlights — combining social sports, casual turf games, box cricket, mini football tournaments, curated music, and high-energy community socializing.

No pro athlete skills needed. Whether you're lacing up your boots to play, rallying with your squad, cheering from the sidelines, or simply here for the music and the people — TURF SZN is built for everyone who wants to get moving, meet people, and feel the vibe.

Location coordinates, match details, schedules, and official dates will be announced very soon.

Lock in your free Early Access RSVP below to get notified first the second dates and venue locations drop.`,
      highlights,
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80'
    );
    console.log('✅ Initial Event seeded: TURF SZN in Chennai, India');
  }
}

initDB();

module.exports = db;
