import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Lock, CreditCard } from 'lucide-react';
import { events } from '../data/events';
import { saveBooking, generateBookingId } from '../data/bookings';

// ─── Stripe setup ────────────────────────────────────────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4242';

const stripeDemoMode = !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.includes('REPLACE');

// Stripe appearance matching SZN brand
const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#D000FF',
    colorBackground: '#171717',
    colorText: '#F0EBDD',
    colorDanger: '#ff4444',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    borderRadius: '0px',
    colorTextPlaceholder: 'rgba(240,235,221,0.3)',
    colorTextSecondary: 'rgba(240,235,221,0.5)',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(240,235,221,0.1)',
      boxShadow: 'none',
      backgroundColor: '#171717',
    },
    '.Input:focus': {
      border: '1px solid #D000FF',
      boxShadow: '0 0 0 1px #D000FF',
    },
    '.Label': {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '10px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(240,235,221,0.4)',
    },
    '.Tab': {
      border: '1px solid rgba(240,235,221,0.1)',
      backgroundColor: '#171717',
    },
    '.Tab--selected': {
      border: '1px solid #D000FF',
    },
    '.Block': {
      border: '1px solid rgba(240,235,221,0.08)',
      backgroundColor: 'transparent',
    },
  },
};

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 'details' | 'payment' | 'confirm';

interface AttendeeForm {
  name: string;
  email: string;
  phone: string;
}

// ─── Stripe Payment Form component ───────────────────────────────────────────
interface PaymentFormProps {
  total: number;
  onSuccess: (bookingId: string) => void;
  attendee: AttendeeForm;
  eventTitle: string;
  tierName: string;
}

function StripePaymentForm({
  total,
  onSuccess,
  attendee,
  eventTitle,
  tierName,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Create PaymentIntent on server
      const res = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'inr',
          metadata: { event: eventTitle, attendee: attendee.name, tier: tierName },
        }),
      });

      const { clientSecret, error: serverError } = await res.json();
      if (serverError) throw new Error(serverError);

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name: attendee.name,
              email: attendee.email,
              phone: attendee.phone,
            },
          },
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message ?? 'Payment failed.');
        setLoading(false);
        return;
      }

      const id = generateBookingId();
      onSuccess(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'upi'],
        }}
      />

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 border border-red-500/40 bg-red-500/10 p-4"
        >
          <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
          <p className="font-dm text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full font-grotesk text-xs tracking-widest uppercase font-bold py-5 flex items-center justify-center gap-3 transition-all duration-300 ${
          loading
            ? 'bg-szn-magenta/50 text-szn-black/50 cursor-not-allowed'
            : 'bg-szn-magenta text-szn-black hover:bg-szn-cream'
        }`}
      >
        {loading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-szn-black/30 border-t-szn-black rounded-full" />
            PROCESSING...
          </>
        ) : (
          <>
            <Lock size={13} />
            PAY ₹{total} SECURELY
          </>
        )}
      </button>

      {/* Stripe badge */}
      <div className="flex items-center justify-center gap-2 opacity-40">
        <Lock size={10} className="text-szn-cream" />
        <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream">
          Secured by Stripe
        </span>
      </div>
    </form>
  );
}

// ─── Demo payment form (no Stripe keys configured) ───────────────────────────
function DemoPaymentForm({ total, onSuccess }: { total: number; onSuccess: (id: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    onSuccess(generateBookingId());
  };

  const inputClass = (field: string) =>
    `w-full bg-szn-charcoal border ${focused === field ? 'border-szn-magenta' : 'border-white/10'} text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors placeholder:text-szn-cream/25`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Demo notice */}
      <div className="flex items-start gap-3 border border-szn-magenta/30 bg-szn-magenta/5 p-4">
        <CreditCard size={14} className="text-szn-magenta mt-0.5 shrink-0" />
        <div>
          <p className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta mb-1">
            DEMO MODE — Stripe keys not configured
          </p>
          <p className="font-dm text-szn-cream/50 text-xs leading-relaxed">
            Add your Stripe test keys to <code className="text-szn-magenta">.env</code> files to enable real Stripe payments.{' '}
            Use test card <span className="text-szn-cream font-mono">4242 4242 4242 4242</span> once configured.
          </p>
        </div>
      </div>

      {/* Card name */}
      <div>
        <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">NAME ON CARD</label>
        <input
          type="text"
          value={card.name}
          onChange={e => setCard({ ...card, name: e.target.value })}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
          placeholder="Full name"
          className={inputClass('name')}
          required
        />
      </div>

      {/* Card number */}
      <div>
        <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">CARD NUMBER</label>
        <div className="relative">
          <input
            type="text"
            value={card.number}
            onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
            onFocus={() => setFocused('number')}
            onBlur={() => setFocused(null)}
            placeholder="4242 4242 4242 4242"
            className={`${inputClass('number')} font-mono tracking-wider pr-12`}
            maxLength={19}
            required
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            {/* Card brand icon placeholder */}
            <div className="w-8 h-5 bg-szn-cream/10 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">EXPIRY</label>
          <input
            type="text"
            value={card.expiry}
            onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
            onFocus={() => setFocused('expiry')}
            onBlur={() => setFocused(null)}
            placeholder="MM / YY"
            className={`${inputClass('expiry')} font-mono`}
            maxLength={7}
            required
          />
        </div>
        <div>
          <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">CVC</label>
          <input
            type="text"
            value={card.cvc}
            onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            onFocus={() => setFocused('cvc')}
            onBlur={() => setFocused(null)}
            placeholder="•••"
            className={`${inputClass('cvc')} font-mono`}
            maxLength={4}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-grotesk text-xs tracking-widest uppercase font-bold py-5 flex items-center justify-center gap-3 transition-all duration-300 ${
          loading ? 'bg-szn-magenta/50 text-szn-black/50 cursor-not-allowed' : 'bg-szn-magenta text-szn-black hover:bg-szn-cream'
        }`}
      >
        {loading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-szn-black/30 border-t-szn-black rounded-full" />
            PROCESSING...
          </>
        ) : (
          <>
            <Lock size={13} /> PAY ₹{total}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 opacity-40">
        <Lock size={10} className="text-szn-cream" />
        <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream">
          Powered by Stripe (Demo)
        </span>
      </div>
    </form>
  );
}

// ─── Stripe wrapper ───────────────────────────────────────────────────────────
interface StripeWrapperProps {
  total: number;
  attendee: AttendeeForm;
  eventTitle: string;
  tierName: string;
  onSuccess: (id: string) => void;
}

function StripeWrapper(props: StripeWrapperProps) {
  if (stripeDemoMode) {
    return <DemoPaymentForm total={props.total} onSuccess={props.onSuccess} />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: Math.round(props.total * 100),
        currency: 'inr',
        appearance: stripeAppearance,
      }}
    >
      <StripePaymentForm {...props} />
    </Elements>
  );
}

// ─── Free registration form ───────────────────────────────────────────────────
function FreeForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onSuccess(generateBookingId());
  };

  return (
    <div className="space-y-5">
      <div className="border border-szn-magenta/30 bg-szn-magenta/5 p-5">
        <div className="flex items-center gap-3 mb-2">
          <Check size={14} className="text-szn-magenta" />
          <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta font-semibold">
            FREE PRIORITY RSVP — NO PAYMENT REQUIRED
          </span>
        </div>
        <p className="font-dm text-szn-cream/60 text-xs leading-relaxed">
          Lock in your early access priority slot for TURF SZN. You will be the very first to receive exact turf venue deeds, match brackets, and timing before public release.
        </p>
      </div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`w-full font-grotesk text-xs tracking-widest uppercase font-bold py-5 flex items-center justify-center gap-3 transition-all duration-300 ${
          loading ? 'bg-szn-magenta/50 text-szn-black/50 cursor-not-allowed' : 'bg-szn-magenta text-szn-black hover:bg-szn-cream'
        }`}
      >
        {loading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-szn-black/30 border-t-szn-black rounded-full" />
            RESERVING SPOT...
          </>
        ) : (
          <>
            <Check size={13} /> CONFIRM PRIORITY RSVP
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main BookingPage ─────────────────────────────────────────────────────────
export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const event = events.find(e => e.slug === slug);
  const tierIndex = parseInt(searchParams.get('tier') ?? '0');
  const qty = parseInt(searchParams.get('qty') ?? '1');

  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<AttendeeForm>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<AttendeeForm>>({});
  const [bookingId, setBookingId] = useState('');

  useEffect(() => { if (!event) navigate('/events'); }, [event, navigate]);
  if (!event) return null;

  const tier = event.tickets[tierIndex] ?? event.tickets[0];
  const total = tier.price * qty;
  const isFree = event.priceType === 'FREE' || total === 0;

  const validate = () => {
    const errs: Partial<AttendeeForm> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Valid phone required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDetailsNext = () => {
    if (validate()) setStep('payment');
  };

  const handleSuccess = (id: string) => {
    setBookingId(id);
    saveBooking({
      id,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      ticketTier: tier.name,
      ticketPrice: tier.price,
      quantity: qty,
      attendeeName: form.name,
      email: form.email,
      phone: form.phone,
      bookingDate: new Date().toISOString(),
      status: 'upcoming',
      total,
    });
    setStep('confirm');
  };

  const steps: Step[] = ['details', 'payment', 'confirm'];
  const stepIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-szn-black pt-28 pb-20 px-6 md:px-10">
      {/* Back */}
      {step !== 'confirm' && (
        <button
          onClick={() => step === 'details' ? navigate(`/events/${slug}`) : setStep('details')}
          className="inline-flex items-center gap-2 font-grotesk text-xs tracking-widest uppercase text-szn-cream/50 hover:text-szn-cream transition-colors mb-10"
        >
          <ArrowLeft size={12} /> BACK
        </button>
      )}

      {/* Progress stepper */}
      {step !== 'confirm' && (
        <div className="flex items-center gap-0 mb-12 max-w-sm border border-white/10">
          {(['details', 'payment'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[9px] font-grotesk tracking-widest uppercase transition-all border-r last:border-r-0 border-white/10 ${
                s === step
                  ? 'bg-szn-magenta text-szn-black'
                  : stepIdx > i
                  ? 'bg-szn-charcoal text-szn-cream/60'
                  : 'text-szn-cream/25'
              }`}
            >
              {stepIdx > i ? <Check size={9} /> : <span className="text-[9px]">{i + 1}</span>}
              {s === 'details' ? 'YOUR DETAILS' : 'PAYMENT'}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* ── Left form panel ── */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">

            {/* STEP 1: Details */}
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-2">STEP 01</span>
                <h2 className="font-anton text-4xl md:text-6xl tracking-tighter uppercase text-szn-cream mb-10">
                  YOUR DETAILS
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">FULL NAME *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className={`w-full bg-szn-charcoal border ${errors.name ? 'border-red-500/60' : 'border-white/10 focus:border-szn-magenta'} text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors`}
                    />
                    {errors.name && <p className="font-dm text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className={`w-full bg-szn-charcoal border ${errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-szn-magenta'} text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors`}
                    />
                    {errors.email && <p className="font-dm text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 block mb-2">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                      className={`w-full bg-szn-charcoal border ${errors.phone ? 'border-red-500/60' : 'border-white/10 focus:border-szn-magenta'} text-szn-cream font-dm text-sm px-4 py-3 outline-none transition-colors`}
                    />
                    {errors.phone && <p className="font-dm text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <button
                    onClick={handleDetailsNext}
                    className="w-full bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold py-4 hover:bg-szn-cream transition-colors duration-300 flex items-center justify-center gap-2 mt-4"
                  >
                    CONTINUE TO PAYMENT <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-2">STEP 02</span>
                <h2 className="font-anton text-4xl md:text-6xl tracking-tighter uppercase text-szn-cream mb-3">
                  {isFree ? 'CONFIRM SPOT' : 'PAYMENT'}
                </h2>
                <p className="font-dm text-szn-cream/40 text-sm mb-10">
                  {isFree
                    ? 'Free event — no card required.'
                    : 'All payments are secured and processed by Stripe.'}
                </p>

                {/* Attendee summary */}
                <div className="border-l-2 border-szn-magenta pl-4 mb-8">
                  <p className="font-grotesk text-[10px] tracking-widest uppercase text-szn-cream/40 mb-1">BOOKING FOR</p>
                  <p className="font-dm text-szn-cream text-sm font-medium">{form.name}</p>
                  <p className="font-dm text-szn-cream/50 text-xs">{form.email} · {form.phone}</p>
                </div>

                {/* Payment form */}
                {isFree ? (
                  <FreeForm onSuccess={handleSuccess} />
                ) : (
                  <StripeWrapper
                    total={total}
                    attendee={form}
                    eventTitle={event.title}
                    tierName={tier.name}
                    onSuccess={handleSuccess}
                  />
                )}

                {/* Test card hint (only in demo / test mode) */}
                {!isFree && (
                  <div className="mt-6 border border-white/8 bg-white/3 p-4">
                    <p className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/25 mb-2">STRIPE TEST CARDS</p>
                    <div className="space-y-1">
                      {[
                        { label: 'Success', num: '4242 4242 4242 4242' },
                        { label: 'Auth Required', num: '4000 0025 0000 3155' },
                        { label: 'Declined', num: '4000 0000 0000 9995' },
                      ].map(c => (
                        <div key={c.label} className="flex justify-between">
                          <span className="font-grotesk text-[9px] text-szn-cream/25 uppercase">{c.label}</span>
                          <span className="font-mono text-[9px] text-szn-cream/40">{c.num}</span>
                        </div>
                      ))}
                      <p className="font-grotesk text-[9px] text-szn-cream/20 mt-1">Use any future date · any 3-digit CVC</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Confirm */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-16 h-16 bg-szn-magenta flex items-center justify-center mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <Check size={28} className="text-szn-black" />
                </motion.div>

                <h2 className="font-anton text-4xl md:text-7xl tracking-tighter uppercase text-szn-cream mb-3">
                  YOU'RE IN.
                </h2>
                <p className="font-instrument text-xl italic text-szn-cream/50 mb-10">
                  {isFree
                    ? `Your free spot is confirmed. See you at ${event.venue}.`
                    : `Payment confirmed. See you at ${event.venue}.`}
                </p>

                {/* Booking card */}
                <div className="border border-szn-magenta bg-szn-magenta/5 p-6 mb-8 max-w-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-magenta block mb-1">BOOKING CONFIRMED</span>
                      <span className="font-anton text-xl text-szn-cream">{bookingId}</span>
                    </div>
                    <span className={`font-grotesk text-[9px] tracking-widest uppercase px-2 py-1 ${isFree ? 'bg-szn-magenta text-szn-black' : 'bg-szn-cream text-szn-black'}`}>
                      {isFree ? 'FREE' : `₹${total} PAID`}
                    </span>
                  </div>

                  {/* QR placeholder */}
                  <div className="border border-white/10 p-3 bg-szn-black/50 w-fit mb-4">
                    <div className="grid grid-cols-7 gap-0.5 w-28 h-28">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            (i < 7 || i > 41 || i % 7 === 0 || i % 7 === 6 || (i >= 14 && i <= 34 && i % 7 >= 2 && i % 7 <= 4 && Math.random() > 0.4))
                              ? 'bg-szn-cream/70'
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-grotesk text-[8px] tracking-widest uppercase text-szn-cream/20 text-center mt-1">QR CODE PLACEHOLDER</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-grotesk text-szn-cream/30 uppercase tracking-wider text-[9px]">Event</span>
                      <span className="font-grotesk text-szn-cream/70 uppercase text-[9px]">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-grotesk text-szn-cream/30 uppercase tracking-wider text-[9px]">Date</span>
                      <span className="font-grotesk text-szn-cream/70 text-[9px]">{event.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-grotesk text-szn-cream/30 uppercase tracking-wider text-[9px]">Ticket</span>
                      <span className="font-grotesk text-szn-cream/70 text-[9px]">{tier.name} ×{qty}</span>
                    </div>
                  </div>
                </div>

                {/* Email hint */}
                <p className="font-dm text-szn-cream/40 text-xs mb-8">
                  Confirmation recorded for <span className="text-szn-cream/70 font-medium">{form.email}</span>. Official turf location deeds and schedule will be delivered to your inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="bg-szn-magenta text-szn-black font-grotesk text-xs tracking-widest uppercase font-bold px-8 py-4 hover:bg-szn-cream transition-colors"
                  >
                    VIEW MY TICKETS
                  </button>
                  <button
                    onClick={() => navigate('/events')}
                    className="border border-szn-cream/20 text-szn-cream/60 font-grotesk text-xs tracking-widest uppercase px-8 py-4 hover:border-szn-cream hover:text-szn-cream transition-colors"
                  >
                    MORE EVENTS
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Right: Order summary ── */}
        {step !== 'confirm' && (
          <div className="md:col-span-2">
            <div className="border border-white/10 p-6 sticky top-24">
              <span className="font-grotesk text-[10px] tracking-widest uppercase text-szn-magenta block mb-5">ORDER SUMMARY</span>

              {/* Event image */}
              <div className="relative overflow-hidden mb-5" style={{ height: '160px' }}>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(100%) contrast(1.3) brightness(0.45)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-szn-black/80 to-transparent" />
                <span className={`absolute bottom-3 left-3 font-grotesk text-[9px] tracking-widest uppercase px-2 py-1 ${isFree ? 'bg-szn-magenta text-szn-black' : 'bg-szn-cream text-szn-black'}`}>
                  {event.priceType}
                </span>
              </div>

              <h3 className="font-anton text-xl tracking-tight uppercase text-szn-cream mb-1">{event.title}</h3>
              <p className="font-grotesk text-xs tracking-wider text-szn-magenta mb-5">{event.date}</p>
              <p className="font-dm text-szn-cream/40 text-xs mb-5">{event.venue}, {event.location}</p>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-dm text-xs text-szn-cream/50">{tier.name}</span>
                  <span className="font-dm text-xs text-szn-cream">{tier.price === 0 ? 'FREE' : `₹${tier.price}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-dm text-xs text-szn-cream/50">Quantity</span>
                  <span className="font-dm text-xs text-szn-cream">× {qty}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-grotesk text-xs tracking-wider uppercase text-szn-cream/40">Total</span>
                  <span className="font-anton text-2xl text-szn-magenta">{total === 0 ? 'FREE' : `₹${total}`}</span>
                </div>
              </div>

              {/* Secure badges */}
              {!isFree && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={10} className="text-szn-cream/30" />
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30">256-bit SSL encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={10} className="text-szn-cream/30" />
                    <span className="font-grotesk text-[9px] tracking-widest uppercase text-szn-cream/30">Secured by Stripe</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
