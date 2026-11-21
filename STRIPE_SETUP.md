# CLUB SZN — Stripe Integration Setup

## Architecture

```
d:\szn web\
├── club-szn/          ← React frontend (Vite, port 5173)
│   └── .env           ← Stripe publishable key
└── szn-server/        ← Express backend (port 4242)
    └── .env           ← Stripe secret key
```

## 1. Get Your Stripe Test Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (`pk_test_...`)
3. Copy your **Secret key** (`sk_test_...`)

## 2. Configure Environment Files

**`d:\szn web\szn-server\.env`**
```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
PORT=4242
```

**`d:\szn web\club-szn\.env`**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_API_URL=http://localhost:4242
```

## 3. Run the App

Open **two terminals**:

**Terminal 1 — Payment server:**
```bash
cd "d:\szn web\szn-server"
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd "d:\szn web\club-szn"
npm run dev
```

Then open: **http://localhost:5173**

## 4. Test Cards (Stripe Test Mode)

| Scenario | Card Number |
|----------|-------------|
| ✅ Payment succeeds | `4242 4242 4242 4242` |
| 🔐 Requires 3D Secure auth | `4000 0025 0000 3155` |
| ❌ Card declined | `4000 0000 0000 9995` |
| ❌ Insufficient funds | `4000 0000 0000 9995` |

Use **any future date** for expiry, and **any 3 digits** for CVC.

## 5. Demo Mode (No Keys)

If you don't add Stripe keys, the booking flow uses a **branded demo card form** that simulates a successful payment after a 1.8s delay. No real Stripe connection is made.

## 6. How the Payment Flow Works

```
User fills details (name, email, phone)
        ↓
Clicks "Continue to Payment"
        ↓
Stripe Payment Element loads (card, UPI, etc.)
        ↓
User submits payment
        ↓
Frontend calls: POST http://localhost:4242/create-payment-intent
  → Server creates PaymentIntent with Stripe API
  → Returns clientSecret
        ↓
Frontend calls: stripe.confirmPayment(clientSecret)
  → Stripe processes payment
        ↓
Success → Booking saved to localStorage
  → Confirmation page with booking ID + QR placeholder
```

## 7. Currency

Payments are processed in **INR (Indian Rupees)**. Stripe converts the ₹ amount to paise (×100) for the API automatically.
