import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  favorites: [{ type: String }], // Array of Place Names
  visited: [{ type: String }], // Array of Place Names
  badges: [{
    name: { type: String, required: true },
    icon: { type: String, required: true },
    desc: { type: String, required: true },
    dateEarned: { type: Date, default: Date.now }
  }],
  stats: {
    distanceTraveled: { type: Number, default: 0 },
    placesVisited: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    points: { type: Number, default: 0 }
  },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Place Schema
const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  state: { type: String, default: "" },
  country: { type: String, required: true },
  continent: { type: String, default: "asia" },
  emoji: { type: String, default: "📍" },
  badge: { type: String, default: "Explore" },
  desc: { type: String, required: true },
  history: { type: String, default: "" },
  bestSeason: { type: String, default: "All Year" },
  types: [{ type: String }], // e.g. ["solo", "couple", "family"]
  solo: { type: String, default: "Great for solo travelers." },
  couple: { type: String, default: "Romantic destination." },
  family: { type: String, default: "Family friendly." },
  budget: { type: String, default: "€€" },
  visa: { type: String, default: "Visa on arrival / Electronic" },
  lang: { type: String, default: "English" },
  currency: { type: String, default: "USD ($)" },
  timezone: { type: String, default: "UTC" },
  tags: [{ type: String }], // e.g. ["heritage", "nature"]
  rating: { type: Number, default: 4.5 },
  reviews: [{
    username: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  }],
  // Global coverage extensions
  weather: { type: String, default: "24°C Sunny" },
  temperature: { type: Number, default: 24 },
  sunrise: { type: String, default: "06:00 AM" },
  sunset: { type: String, default: "06:30 PM" },
  internetQuality: { type: String, default: "High (4G/5G/Fiber)" },
  safetyRating: { type: Number, default: 4.8 }, // 1 to 5
  familyRating: { type: Number, default: 4.6 },
  soloRating: { type: Number, default: 4.5 },
  coupleRating: { type: Number, default: 4.7 },
  nightlife: { type: String, default: "Moderate" },
  food: { type: String, default: "Excellent local street food & fine dining" },
  culture: { type: String, default: "Rich local heritage and warm hospitality" },
  festivals: { type: String, default: "Seasonal community events" },
  emergencyContacts: { type: String, default: "Police: 112 / Medical: 112" },
  travelTips: { type: String, default: "Keep local cash. Respect cultural traditions." }
});

// Seed data interfaces
export const User = mongoose.model('User', UserSchema);
export const Place = mongoose.model('Place', PlaceSchema);
