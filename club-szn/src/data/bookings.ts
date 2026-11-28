export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketTier: string;
  ticketPrice: number;
  quantity: number;
  attendeeName: string;
  email: string;
  phone: string;
  bookingDate: string;
  status: 'upcoming' | 'past' | 'checked_in';
  total: number;
}

// Local storage key
export const BOOKINGS_KEY = 'szn_bookings';

export function getBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SZN-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
