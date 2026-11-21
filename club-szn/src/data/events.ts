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
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80',
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
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
    category: 'Games',
    caption: 'Under the Floodlights — Turf SZN',
    aspect: 'landscape',
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
    category: 'Social Meetups',
    caption: 'Social SZN — Community Vibes',
    aspect: 'portrait',
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    category: 'Games',
    caption: 'Turf Match SZN',
    aspect: 'landscape',
  },
  {
    id: 'g4',
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    category: 'Parties',
    caption: 'Night SZN Energy',
    aspect: 'landscape',
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1543079467-a9ea9d8e1ef4?w=600&q=80',
    category: 'Games',
    caption: 'Game SZN Competitions',
    aspect: 'square',
  },
  {
    id: 'g6',
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
    category: 'Community Moments',
    caption: 'The People of SZN',
    aspect: 'portrait',
  },
  {
    id: 'g7',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    category: 'Festival Celebrations',
    caption: 'Celebration SZN',
    aspect: 'landscape',
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
    category: 'Social Meetups',
    caption: 'New Connections',
    aspect: 'square',
  },
  {
    id: 'g9',
    src: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=600&q=80',
    category: 'Parties',
    caption: 'Music & Sets',
    aspect: 'portrait',
  },
  {
    id: 'g10',
    src: 'https://images.unsplash.com/photo-1536745511163-cc7f06aa8b88?w=600&q=80',
    category: 'Community Moments',
    caption: 'Unforgettable Moments',
    aspect: 'landscape',
  },
  {
    id: 'g11',
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    category: 'Festival Celebrations',
    caption: 'Gathering SZN',
    aspect: 'square',
  },
  {
    id: 'g12',
    src: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=80',
    category: 'Games',
    caption: 'Squad Challenge SZN',
    aspect: 'landscape',
  },
];
