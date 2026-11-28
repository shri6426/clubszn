export type EventCategory = 'SOCIAL' | 'PARTIES' | 'GAMES' | 'SPECIAL EVENTS';
export type PriceType = 'FREE' | 'PAID';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
  total: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  priceType: PriceType;
  description: string;
  fullDescription: string;
  highlights: string[];
  imageUrl: string;
  posterColor: string;
  tags: string[];
  tickets: TicketTier[];
  featured: boolean;
  soldOut?: boolean;
}

export const events: Event[] = [
  {
    id: 'turf-szn-01',
    slug: 'turf-szn',
    title: 'TURF SZN',
    category: 'GAMES',
    date: 'DATES ANNOUNCING SOON',
    time: 'EVENING — TIME TBA',
    venue: 'TURF ARENA — REVEALING SOON',
    location: 'Chennai, India',
    price: 0,
    priceType: 'FREE',
    description: 'The premier turf edition of Club SZN. Social football, box cricket, turf challenges, DJ sets and electric floodlit energy.',
    fullDescription: `CLUB SZN IS TAKING OVER THE TURF.

Get ready for an electric evening under the stadium floodlights — combining social sports, casual turf games, box cricket, mini football tournaments, curated music, and high-energy community socializing.

No pro athlete skills needed. Whether you're lacing up your boots to play, rallying with your squad, cheering from the sidelines, or simply here for the music and the people — TURF SZN is built for everyone who wants to get moving, meet people, and feel the vibe.

Location coordinates, match details, schedules, and official dates will be announced very soon.

Lock in your free Early Access RSVP below to get notified first the second dates and venue locations drop.`,
    highlights: [
      'Floodlit evening arena takeover',
      'Social Football & Box Cricket matches',
      'Group challenges & open games',
      'Live DJ sets & curated soundscape',
      'Sideline hangout zones & refreshments',
      'Exclusive SZN turf jersey drops & photo coverage',
    ],
    imageUrl: '/gallery/img_0595.jpg',
    posterColor: '#D000FF',
    tags: ['Turf', 'Social Sports', 'Football', 'Cricket', 'Music', 'Announcing Soon'],
    tickets: [
      {
        id: 't1',
        name: 'EARLY ACCESS RSVP (FREE)',
        price: 0,
        description: 'Priority waitlist pass. Get first access to player slots, match brackets, and venue announcements before public release.',
        available: 120,
        total: 200,
      },
      {
        id: 't2',
        name: 'PLAYER PASS (DROPPING SOON)',
        price: 0,
        description: 'Competitive & casual tournament entry slot. Final date, turf venue location & fee announced soon.',
        available: 40,
        total: 50,
      },
    ],
    featured: true,
  },
];

export const galleryImages = [
  { id: 'g01', src: '/gallery/img_0388.jpg', aspect: 'landscape' },
  { id: 'g02', src: '/gallery/img_0422.jpg', aspect: 'landscape' },
  { id: 'g03', src: '/gallery/img_0443.jpg', aspect: 'landscape' },
  { id: 'g04', src: '/gallery/img_0453.jpg', aspect: 'landscape' },
  { id: 'g05', src: '/gallery/img_0462.jpg', aspect: 'landscape' },
  { id: 'g06', src: '/gallery/img_0465.jpg', aspect: 'landscape' },
  { id: 'g07', src: '/gallery/img_0517.jpg', aspect: 'landscape' },
  { id: 'g08', src: '/gallery/img_0547.jpg', aspect: 'landscape' },
  { id: 'g09', src: '/gallery/img_0557.jpg', aspect: 'landscape' },
  { id: 'g10', src: '/gallery/img_0564.jpg', aspect: 'landscape' },
  { id: 'g11', src: '/gallery/img_0595.jpg', aspect: 'landscape' },
  { id: 'g12', src: '/gallery/img_0618.jpg', aspect: 'landscape' },
  { id: 'g13', src: '/gallery/img_0619.jpg', aspect: 'landscape' },
  { id: 'g14', src: '/gallery/img_0668.jpg', aspect: 'landscape' },
  { id: 'g15', src: '/gallery/img_0676.jpg', aspect: 'landscape' },
  { id: 'g16', src: '/gallery/img_0687.jpg', aspect: 'landscape' },
];
