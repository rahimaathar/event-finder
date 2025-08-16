interface City {
  value: string;
  label: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface CitiesMap {
  [key: string]: City[];
}

export const states = [
    
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "IL", label: "Illinois" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
  { value: "NV", label: "Nevada" },
] as const;

export const cities: CitiesMap = {
  CA: [
    { value: "SF", label: "San Francisco", coordinates: { lat: 37.7749, lng: -122.4194 } },
    { value: "LA", label: "Los Angeles", coordinates: { lat: 34.0522, lng: -118.2437 } },
    { value: "SD", label: "San Diego", coordinates: { lat: 32.7157, lng: -117.1611 } },
    { value: "SJ", label: "San Jose", coordinates: { lat: 37.3382, lng: -121.8863 } },
  ],
  NY: [
    { value: "NYC", label: "New York City", coordinates: { lat: 40.7128, lng: -74.006 } },
    { value: "BUF", label: "Buffalo", coordinates: { lat: 42.8864, lng: -78.8784 } },
    { value: "ROC", label: "Rochester", coordinates: { lat: 43.1566, lng: -77.6088 } },
  ],
  TX: [
    { value: "HOU", label: "Houston", coordinates: { lat: 29.7604, lng: -95.3698 } },
    { value: "AUS", label: "Austin", coordinates: { lat: 30.2672, lng: -97.7431 } },
    { value: "DAL", label: "Dallas", coordinates: { lat: 32.7767, lng: -96.797 } },
  ],
  IL: [
    { value: "CHI", label: "Chicago", coordinates: { lat: 41.8781, lng: -87.6298 } },
    { value: "SPI", label: "Springfield", coordinates: { lat: 39.7817, lng: -89.6501 } },
  ],
  FL: [
    { value: "MIA", label: "Miami", coordinates: { lat: 25.7617, lng: -80.1918 } },
    { value: "ORL", label: "Orlando", coordinates: { lat: 28.5383, lng: -81.3792 } },
    { value: "TPA", label: "Tampa", coordinates: { lat: 27.9506, lng: -82.4572 } },
  ],
  WA: [
    { value: "SEA", label: "Seattle", coordinates: { lat: 47.6062, lng: -122.3321 } },
    { value: "TAC", label: "Tacoma", coordinates: { lat: 47.2529, lng: -122.4443 } },
  ],
  NV: [
    { value: "LV", label: "Las Vegas", coordinates: { lat: 36.1699, lng: -115.1398 } },
    { value: "RNO", label: "Reno", coordinates: { lat: 39.5296, lng: -119.8138 } },
  ],
};

export const categories = [
  { value: "all", label: "All Categories" },
  { value: "music", label: "Music" },
  { value: "tech", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "food", label: "Food & Drink" },
  { value: "arts", label: "Arts & Culture" },
];

export const mockEvents = [
  // Existing events (1–20) from your file...
  {
    id: "21",
    name: { text: "Chicago Blues Festival" },
    description: { text: "The largest free blues festival in the world." },
    start: { local: "2025-06-07T12:00:00" },
    url: "https://example.com/event/21",
    venue: {
      name: "Millennium Park",
      latitude: "41.8826",
      longitude: "-87.6226",
      address: { localized_address_display: "Chicago, IL" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "Free" },
    },
    category: "music",
  },
  {
    id: "22",
    name: { text: "Miami Art Basel" },
    description: { text: "World-renowned art show featuring galleries from across the globe." },
    start: { local: "2025-12-04T10:00:00" },
    url: "https://example.com/event/22",
    venue: {
      name: "Miami Beach Convention Center",
      latitude: "25.7959",
      longitude: "-80.1333",
      address: { localized_address_display: "1901 Convention Center Dr, Miami Beach, FL" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "$65" },
    },
    category: "arts",
  },
  {
    id: "23",
    name: { text: "Seattle Tech Week" },
    description: { text: "A week-long series of events for startups and tech enthusiasts." },
    start: { local: "2025-05-20T09:00:00" },
    url: "https://example.com/event/23",
    venue: {
      name: "Seattle Convention Center",
      latitude: "47.6126",
      longitude: "-122.3316",
      address: { localized_address_display: "705 Pike St, Seattle, WA" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "$99" },
    },
    category: "tech",
  },
  {
    id: "24",
    name: { text: "Las Vegas Food Expo" },
    description: { text: "Discover new culinary trends with top chefs and vendors." },
    start: { local: "2025-09-25T11:00:00" },
    url: "https://example.com/event/24",
    venue: {
      name: "Las Vegas Convention Center",
      latitude: "36.1311",
      longitude: "-115.1522",
      address: { localized_address_display: "3150 Paradise Rd, Las Vegas, NV" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "$45" },
    },
    category: "food",
  },
  {
    id: "25",
    name: { text: "Orlando Magic vs. Miami Heat" },
    description: { text: "NBA showdown between Florida rivals." },
    start: { local: "2025-03-18T19:30:00" },
    url: "https://example.com/event/25",
    venue: {
      name: "Kia Center",
      latitude: "28.5392",
      longitude: "-81.3839",
      address: { localized_address_display: "400 W Church St #200, Orlando, FL" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "$110" },
    },
    category: "sports",
  },
  {
    id: "26",
    name: { text: "Reno Hot Air Balloon Race" },
    description: { text: "The world’s largest free hot-air ballooning event." },
    start: { local: "2025-09-06T05:00:00" },
    url: "https://example.com/event/26",
    venue: {
      name: "Rancho San Rafael Regional Park",
      latitude: "39.5412",
      longitude: "-119.8296",
      address: { localized_address_display: "1595 N Sierra St, Reno, NV" },
    },
    ticket_availability: {
      has_available_tickets: true,
      minimum_ticket_price: { display: "Free" },
    },
    category: "arts",
  },
];
