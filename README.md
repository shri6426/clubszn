# CLUB SZN 

> **Youth-focused socializing & community events brand — Chennai, India.**  
> Powered by **Mechstrek**

CLUB SZN is an experimental digital magazine and underground youth culture platform for socializing and events. Inspired by Swiss brutalism, International Typographic Style, and unconventional poster layouts.

---

## ⚡ Active Event Announcement: TURF SZN
- **Location:** Chennai, India
- **Venue:** Arena Turf (Revealing Soon)
- **Schedule:** Dates Announcing Soon
- **Experience:** Social football, box cricket, turf challenges, live DJ sets & community under floodlights.
- **Access:** Early Access Waitlist / Priority RSVP active now.

---

## 📁 Project Structure

```
d:/szn web/
├── club-szn/           # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/ # Navigation, Footer, CustomCursor
│   │   ├── context/    # AuthContext (Role auto-detection for Admin & Members)
│   │   ├── data/       # Events (TURF SZN), Bookings, Gallery images
│   │   ├── pages/      # Home, Events, EventDetail, Booking, MyTickets, Gallery, Login, Admin
│   │   └── hooks/      # Custom cursor & UI hooks
│   └── tailwind.config.js
├── szn-server/         # Express + Stripe Payment Server
│   └── server.js       # PaymentIntent endpoints (INR currency)
├── logo/               # Official metallic CLUB SZN branding
└── STRIPE_SETUP.md     # Stripe integration & test card documentation
```

---

## 🎨 Creative Direction & Design System

- **Colors:**
  - Black: `#050505`
  - Warm off-white: `#F0EBDD`
  - Metallic magenta: `#D000FF`
  - Deep violet: `#8316C8`
  - Charcoal: `#171717`
- **Typography:**
  - Condensed Headlines: `Anton`, `Bebas Neue`
  - Editorial Contrast: `Instrument Serif`
  - Navigation & Labels: `Space Grotesk`
  - Body Text: `DM Sans`
- **Interactions:**
  - Custom dynamic tactical viewfinder reticle pointer (morphs into diagonal `✕` crosshair on interactive hover)
  - Halftone dot matrix & photocopy grain overlays
  - Oversized asymmetric text breaking section bounds
  - Smooth Framer Motion page transitions & scroll animations

---

## 🚀 Running the Project

### 1. Frontend (React + Vite)
```bash
cd club-szn
npm install
npm run dev
```
Runs at: **`http://localhost:5173`**

### 2. Payment Backend (Express + Stripe)
```bash
cd szn-server
npm install
node server.js
```
Runs at: **`http://localhost:4242`**

---

## 🛡️ Admin Command Center (`/admin`)

- Access the unified login at `/login`.
- Entering admin credentials (`clubszn.faq@gmail.com` / `admin123`) or choosing the admin Google account automatically routes to `/admin`.
- Features: Live RSVP tracker, Door Check-In, Event Date/Venue live announcement editor, Guestlist CSV Export.

---

© 2026 CLUB SZN. All rights reserved. Powered by Mechstrek.
