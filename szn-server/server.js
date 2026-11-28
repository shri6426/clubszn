require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51REPLACE_WITH_YOUR_TEST_KEY';
const stripe = require('stripe')(stripeKey);

const JWT_SECRET = process.env.JWT_SECRET || 'club_szn_jwt_secret_token_key_2026';
const ADMIN_EMAILS = [
  'clubszn.faq@gmail.com',
  'admin@clubszn.in',
  'admin@clubszn.com',
  'admin@gmail.com',
  'sznclub@gmail.com',
  'admin.szn@gmail.com'
];

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Auth Middleware: requires valid user JWT
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Admin Middleware: requires user to have admin role
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

// ─── AUTHENTICATION ROUTES ───────────────────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const role = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, provider)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, cleanEmail, hash, name.trim(), role, 'email');

    const newUser = { id, email: cleanEmail, name: name.trim(), role, provider: 'email' };
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      // Auto-provision standard member if first time login with mock
      if (!ADMIN_EMAILS.includes(cleanEmail) && !cleanEmail.startsWith('admin@')) {
        const id = 'user-' + Date.now();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const name = cleanEmail.split('@')[0];

        db.prepare(`
          INSERT INTO users (id, email, password_hash, name, role, provider)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, cleanEmail, hash, name, 'user', 'email');

        const newUser = { id, email: cleanEmail, name, role: 'user', provider: 'email' };
        return res.json({ user: newUser, token: generateToken(newUser) });
      }

      return res.status(401).json({ error: 'Account not found with this email' });
    }

    // Verify password
    const valid = user.password_hash ? bcrypt.compareSync(password, user.password_hash) : false;
    // Allow demo admin fallback if password matches admin123
    const isDemoAdminPass = ADMIN_EMAILS.includes(cleanEmail) && (password === 'admin123' || password === 'szn2026');

    if (!valid && !isDemoAdminPass) {
      return res.status(401).json({ error: 'Incorrect password. (For admin, use admin123)' });
    }

    // Auto promote to admin if email is on admin whitelist
    let role = user.role;
    if (ADMIN_EMAILS.includes(cleanEmail) && role !== 'admin') {
      role = 'admin';
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', user.id);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      avatar: user.avatar,
      provider: user.provider
    };

    res.json({ user: safeUser, token: generateToken(safeUser) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/google
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.startsWith('admin@');
    const role = isAdmin ? 'admin' : 'user';
    const displayName = name || (isAdmin ? 'SZN Administrator' : cleanEmail.split('@')[0]);

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      const id = 'google-' + Date.now();
      db.prepare(`
        INSERT INTO users (id, email, name, role, provider, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, cleanEmail, displayName, role, 'google', avatar || null);

      user = { id, email: cleanEmail, name: displayName, role, provider: 'google', avatar };
    } else {
      if (isAdmin && user.role !== 'admin') {
        db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', user.id);
        user.role = 'admin';
      }
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      provider: 'google'
    };

    res.json({ user: safeUser, token: generateToken(safeUser) });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, provider, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// ─── EVENTS ROUTES ───────────────────────────────────────────────────────────

// GET /api/events
app.get('/api/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events WHERE is_active = 1 ORDER BY created_at DESC').all();
  const parsed = events.map(e => ({
    ...e,
    highlights: JSON.parse(e.highlights || '[]'),
  }));
  res.json({ events: parsed });
});

// GET /api/events/:slug
app.get('/api/events/:slug', (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE slug = ?').get(req.params.slug);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ event: { ...event, highlights: JSON.parse(event.highlights || '[]') } });
});

// PUT /api/admin/events/:id (Update date, venue, location)
app.put('/api/admin/events/:id', requireAdmin, (req, res) => {
  const { date, venue, location, title, description } = req.body;
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  db.prepare(`
    UPDATE events
    SET date = COALESCE(?, date),
        venue = COALESCE(?, venue),
        location = COALESCE(?, location),
        title = COALESCE(?, title),
        description = COALESCE(?, description)
    WHERE id = ?
  `).run(date, venue, location, title, description, req.params.id);

  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json({ event: { ...updated, highlights: JSON.parse(updated.highlights || '[]') } });
});

// ─── BOOKINGS / RSVP ROUTES ─────────────────────────────────────────────────

// POST /api/bookings (Create booking/RSVP tied to authenticated user)
app.post('/api/bookings', requireAuth, (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      eventDate,
      eventTime,
      eventVenue,
      ticketTier,
      ticketPrice = 0,
      quantity = 1,
      attendeeName,
      email,
      phone,
      total = 0,
      paymentIntentId
    } = req.body;

    if (!eventTitle || !attendeeName || !email) {
      return res.status(400).json({ error: 'Attendee name, email, and event details are required' });
    }

    // Generate Booking ID (e.g. SZN-9A4B8C1D)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let bookingId = 'SZN-';
    for (let i = 0; i < 8; i++) {
      bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const userId = req.user.id;
    const paymentStatus = total > 0 ? 'paid' : 'free';

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, event_id, event_title, event_date, event_time, event_venue,
        ticket_tier, ticket_price, quantity, attendee_name, email, phone, status,
        total, payment_status, stripe_payment_intent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      bookingId,
      userId,
      eventId || 'turf-szn-01',
      eventTitle,
      eventDate || 'DATES ANNOUNCING SOON',
      eventTime || 'EVENING — TIME TBA',
      eventVenue || 'TURF ARENA — REVEALING SOON',
      ticketTier || 'EARLY ACCESS RSVP (FREE)',
      ticketPrice,
      quantity,
      attendeeName,
      email,
      phone || '',
      'upcoming',
      total,
      paymentStatus,
      paymentIntentId || null
    );

    const created = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    res.status(201).json({ booking: created });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to record reservation' });
  }
});

// GET /api/bookings/my-tickets (Get logged-in user's bookings)
app.get('/api/bookings/my-tickets', requireAuth, (req, res) => {
  const tickets = db.prepare(`
    SELECT * FROM bookings
    WHERE user_id = ? OR email = ?
    ORDER BY created_at DESC
  `).all(req.user.id, req.user.email);

  res.json({ tickets });
});

// ─── ADMIN DASHBOARD API ROUTES ─────────────────────────────────────────────

// GET /api/admin/bookings (Get full guestlist)
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  res.json({ bookings });
});

// PATCH /api/admin/bookings/:id/checkin (Door check-in toggle)
app.patch('/api/admin/bookings/:id/checkin', requireAdmin, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const newStatus = booking.status === 'checked_in' ? 'upcoming' : 'checked_in';
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(newStatus, req.params.id);

  res.json({ id: req.params.id, status: newStatus });
});

// POST /api/admin/bookings/manual (Manually add attendee)
app.post('/api/admin/bookings/manual', requireAdmin, (req, res) => {
  const { attendeeName, email, phone, ticketTier, eventTitle, eventDate, eventVenue } = req.body;
  if (!attendeeName || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let bookingId = 'SZN-M-';
  for (let i = 0; i < 6; i++) {
    bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  db.prepare(`
    INSERT INTO bookings (
      id, user_id, event_id, event_title, event_date, event_time, event_venue,
      ticket_tier, ticket_price, quantity, attendee_name, email, phone, status, total, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    bookingId,
    'admin-manual',
    'turf-szn-01',
    eventTitle || 'TURF SZN',
    eventDate || 'DATES ANNOUNCING SOON',
    'EVENING — TIME TBA',
    eventVenue || 'TURF ARENA — REVEALING SOON',
    ticketTier || 'EARLY ACCESS RSVP (FREE)',
    0,
    1,
    attendeeName,
    email,
    phone || '',
    'upcoming',
    0,
    'free'
  );

  const created = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  res.status(201).json({ booking: created });
});

// GET /api/admin/stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
  const checkedIn = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'checked_in'").get().count;
  const totalRevenue = db.prepare('SELECT SUM(total) as revenue FROM bookings').get().revenue || 0;
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  res.json({
    totalRSVPs: totalBookings + 100, // Milestone representation
    actualBookingsCount: totalBookings,
    checkedInCount: checkedIn,
    totalRevenue,
    registeredUsersCount: totalUsers
  });
});

// ─── STRIPE PAYMENT INTENT ───────────────────────────────────────────────────
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'CLUB SZN Backend API & Payment Server',
    database: 'SQLite (Active)',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎉 CLUB SZN REST API & Server live at: http://localhost:${PORT}`);
  console.log(`📊 Database: SQLite (database.sqlite)`);
  console.log(`👑 Admin Email: clubszn.faq@gmail.com (Pass: admin123)`);
  console.log(`======================================================\n`);
});
