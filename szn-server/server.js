require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
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
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`\n🎉 SZN Payment Server running on http://localhost:${PORT}`);
  console.log(`   Using Stripe key: ${process.env.STRIPE_SECRET_KEY?.slice(0, 20)}...`);
  if (process.env.STRIPE_SECRET_KEY?.includes('REPLACE')) {
    console.warn('\n⚠️  WARNING: You are using a placeholder Stripe key.');
    console.warn('   Add your real TEST key to szn-server/.env to enable payments.\n');
  }
});
