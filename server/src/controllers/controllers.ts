import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Place } from '../models/Schemas.js';
import { generateItinerary, generateBudgetPlan, chatTravelAssistant, generateHotelDetails, generateRouteDetails } from '../services/gemini.js';
import { worldDestinations, indiaStatesRaw } from '../config/seed.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// In-memory sandbox storage for users if MongoDB connection fails
const sandboxUsers = new Map<string, any>();

// Helper to flatten static seed destinations
const getStaticFallbackPlaces = () => {
  const fallbackList: any[] = [];
  
  worldDestinations.forEach(p => {
    const item = p as any;
    fallbackList.push({
      _id: `fallback_g_${item.name}`,
      name: item.name,
      state: "Global",
      country: item.country,
      continent: item.continent,
      emoji: item.emoji,
      badge: item.badge,
      desc: item.desc,
      history: item.history,
      bestSeason: item.bestSeason,
      types: item.types,
      solo: item.solo,
      couple: item.couple,
      family: item.family,
      budget: item.budget,
      visa: item.visa,
      lang: item.lang,
      currency: item.currency,
      timezone: item.timezone,
      tags: item.tags,
      safetyRating: item.safetyRating || 4.7,
      familyRating: item.familyRating || 4.5,
      soloRating: item.soloRating || 4.6,
      coupleRating: item.coupleRating || 4.8,
      weather: item.weather || "22°C Sunny",
      temperature: item.temperature || 22,
      sunrise: item.sunrise || "06:00 AM",
      sunset: item.sunset || "06:30 PM",
      internetQuality: item.internetQuality || "High (4G/5G/Fiber)",
      nightlife: item.nightlife || "Moderate",
      food: item.food || "Excellent local dining",
      culture: item.culture || "Rich heritage",
      festivals: item.festivals || "Seasonal celebrations",
      emergencyContacts: item.emergencyContacts || "Police: 112",
      travelTips: item.travelTips || "Respect local customs.",
      rating: 4.8,
      reviews: []
    });
  });

  Object.entries(indiaStatesRaw).forEach(([stateName, list]) => {
    list.forEach(p => {
      fallbackList.push({
        _id: `fallback_in_${p.name}`,
        name: p.name,
        state: stateName,
        country: "India",
        continent: "asia",
        emoji: p.emoji,
        badge: p.tags[0] ? p.tags[0].toUpperCase() : "EXPLORE",
        desc: p.desc,
        history: p.history,
        bestSeason: p.bestSeason,
        types: p.types,
        solo: p.solo || `${p.name} offers safe hostels, welcoming cafes, and vibrant local sights suitable for solo trips.`,
        couple: p.couple || `Stunning vistas, romantic evening settings, and quality boutique stays make ${p.name} perfect for couples.`,
        family: p.family || `Safe trails, family heritage walks, and kids-friendly dining places are widely available.`,
        budget: p.budget,
        visa: "ETA / Visa required for international visitors.",
        lang: p.lang,
        currency: p.currency,
        timezone: p.timezone,
        tags: p.tags,
        safetyRating: p.safetyRating,
        familyRating: p.familyRating,
        soloRating: p.soloRating,
        coupleRating: p.coupleRating,
        weather: "25°C Mostly Sunny",
        temperature: 25,
        sunrise: "05:45 AM",
        sunset: "06:15 PM",
        internetQuality: "Good (3G/4G/Wifi)",
        nightlife: "Varies",
        food: "Diverse traditional local specialties",
        culture: "Deep spiritual roots and rich classical art heritage",
        festivals: "Diwali, Holi, and local state celebrations",
        emergencyContacts: "Police: 100, Ambulance: 102",
        travelTips: "Wear comfortable walking shoes. Respect dress codes inside temples.",
        rating: 4.6,
        reviews: []
      });
    });
  });

  return fallbackList;
};

// Helper to filter static in-memory list
const filterStaticPlaces = (q: any) => {
  let list = getStaticFallbackPlaces();
  if (q.search) {
    const term = q.search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.country.toLowerCase().includes(term) ||
      p.state.toLowerCase().includes(term)
    );
  }
  if (q.continent) {
    list = list.filter(p => p.continent === q.continent);
  }
  if (q.state) {
    list = list.filter(p => p.state.toLowerCase() === q.state.toLowerCase());
  }
  if (q.tag) {
    list = list.filter(p => p.tags.includes(q.tag));
  }
  return list;
};

// ==========================================
// AUTH CONTROLLER
// ==========================================

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required registration fields" });
      return;
    }

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      existingUser = sandboxUsers.get(email);
    }

    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mockId = `sandbox_u_${Date.now()}`;
    const userData = {
      _id: mockId,
      name,
      email,
      password: hashedPassword,
      favorites: [],
      visited: [],
      badges: [],
      stats: { distanceTraveled: 0, placesVisited: 0, level: 1, points: 0 }
    };

    try {
      const dbUser = await User.create(userData);
      const token = jwt.sign({ id: dbUser._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: dbUser });
    } catch (dbErr) {
      // Sandbox fallback
      sandboxUsers.set(email, userData);
      const token = jwt.sign({ id: mockId }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({
        token,
        user: {
          id: mockId,
          name,
          email,
          favorites: [],
          visited: [],
          badges: [],
          stats: userData.stats
        }
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    let user: any = null;
    try {
      user = await User.findOne({ email });
    } catch (err) {
      user = sandboxUsers.get(email);
    }

    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        visited: user.visited,
        badges: user.badges,
        stats: user.stats
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    let user: any = null;
    try {
      user = await User.findById(req.userId).select('-password');
    } catch (err) {
      // Look up in sandbox memory users
      user = Array.from(sandboxUsers.values()).find(u => u._id === req.userId);
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleFavorite = async (req: any, res: Response): Promise<void> => {
  try {
    const { placeName } = req.body;
    if (!placeName) {
      res.status(400).json({ error: "Place name is required" });
      return;
    }

    let user: any = null;
    let isSandbox = false;

    try {
      user = await User.findById(req.userId);
    } catch (err) {
      user = Array.from(sandboxUsers.values()).find(u => u._id === req.userId);
      isSandbox = true;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isFav = user.favorites.includes(placeName);
    if (isFav) {
      user.favorites = user.favorites.filter((name: string) => name !== placeName);
    } else {
      user.favorites.push(placeName);
    }

    if (isSandbox) {
      sandboxUsers.set(user.email, user);
    } else {
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleVisited = async (req: any, res: Response): Promise<void> => {
  try {
    const { placeName } = req.body;
    if (!placeName) {
      res.status(400).json({ error: "Place name is required" });
      return;
    }

    let user: any = null;
    let isSandbox = false;

    try {
      user = await User.findById(req.userId);
    } catch (err) {
      user = Array.from(sandboxUsers.values()).find(u => u._id === req.userId);
      isSandbox = true;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.stats) {
      user.stats = { distanceTraveled: 0, placesVisited: 0, level: 1, points: 0 };
    }

    const isVisited = user.visited.includes(placeName);
    if (isVisited) {
      // Remove visited
      user.visited = user.visited.filter((name: string) => name !== placeName);
      if (user.stats.placesVisited > 0) {
        user.stats.placesVisited -= 1;
        user.stats.points = Math.max(0, user.stats.points - 150);
        user.stats.distanceTraveled = Math.max(0, user.stats.distanceTraveled - 450);
      }
    } else {
      // Add visited
      user.visited.push(placeName);
      user.stats.placesVisited += 1;
      user.stats.points += 150;
      user.stats.distanceTraveled += Math.floor(Math.random() * 800) + 200; // Add 200-1000km

      // Award Gamified badges
      const earnedBadgeNames = user.badges.map((b: any) => b.name);
      
      if (user.stats.placesVisited >= 1 && !earnedBadgeNames.includes("Explorer Born")) {
        user.badges.push({ name: "Explorer Born", icon: "🎒", desc: "Visited your first destination on Let's Travel World!" });
      }
      if (user.stats.placesVisited >= 3 && !earnedBadgeNames.includes("Wanderlust Specialist")) {
        user.badges.push({ name: "Wanderlust Specialist", icon: "✈️", desc: "Successfully tracked 3 global destinations." });
      }
      if (user.stats.placesVisited >= 5 && !earnedBadgeNames.includes("Global Nomad")) {
        user.badges.push({ name: "Global Nomad", icon: "🌍", desc: "Explore Every Corner of Earth: 5+ places visited!" });
      }

      // Check category badge
      const staticPlaces = getStaticFallbackPlaces();
      const place = staticPlaces.find(p => p.name.toLowerCase() === placeName.toLowerCase());
      if (place) {
        if (place.tags.includes("heritage") && !earnedBadgeNames.includes("Historian")) {
          user.badges.push({ name: "Historian", icon: "🏛️", desc: "Discovered an ancient monument or UNESCO heritage site." });
        }
        if (place.tags.includes("beach") && !earnedBadgeNames.includes("Beach Bum")) {
          user.badges.push({ name: "Beach Bum", icon: "🏖️", desc: "Soaked in the sun at a pristine beach destination." });
        }
      }
    }

    user.stats.level = Math.floor(user.stats.points / 500) + 1;

    if (isSandbox) {
      sandboxUsers.set(user.email, user);
    } else {
      await user.save();
    }

    res.json({ visited: user.visited, stats: user.stats, badges: user.badges });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// PLACE CONTROLLER
// ==========================================

export const getPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, continent, tag, state } = req.query;
    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { country: { $regex: search as string, $options: 'i' } },
        { state: { $regex: search as string, $options: 'i' } }
      ];
    }
    if (continent) {
      query.continent = continent as string;
    }
    if (state) {
      query.state = state as string;
    }
    if (tag) {
      query.tags = tag as string;
    }

    try {
      const places = await Place.find(query).limit(100);
      if (places.length === 0) {
        res.json(filterStaticPlaces(query));
      } else {
        res.json(places);
      }
    } catch (dbErr) {
      res.json(filterStaticPlaces(query));
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaceByName = async (req: Request, res: Response): Promise<void> => {
  try {
    let place = null;
    try {
      place = await Place.findOne({ name: req.params.name });
    } catch (dbErr) {
      place = null;
    }

    if (!place) {
      // Find in local memory
      const staticPlaces = getStaticFallbackPlaces();
      place = staticPlaces.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
    }

    if (!place) {
      res.status(404).json({ error: "Place not found" });
      return;
    }
    res.json(place);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { comment, rating } = req.body;
    if (!comment || !rating) {
      res.status(400).json({ error: "Comment and rating are required" });
      return;
    }

    let user: any = null;
    try {
      user = await User.findById(req.userId);
    } catch (err) {
      user = Array.from(sandboxUsers.values()).find(u => u._id === req.userId);
    }
    const username = user ? user.name : "Anonymous Explorer";

    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        res.status(404).json({ error: "Place not found in database sandbox" });
        return;
      }
      place.reviews.push({ username, comment, rating: Number(rating), date: new Date() });
      const totalRating = place.reviews.reduce((acc, curr) => acc + curr.rating, 0);
      place.rating = Number((totalRating / place.reviews.length).toFixed(1));
      await place.save();
      res.json(place);
    } catch (dbErr) {
      // Simulate success in memory
      res.json({
        _id: req.params.id,
        name: "Sandbox Place",
        rating: Number(rating),
        reviews: [{ username, comment, rating: Number(rating), date: new Date() }]
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// AI CONTROLLER
// ==========================================

export const generateItineraryEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, days, groupType, theme } = req.body;
    if (!destination || !days) {
      res.status(400).json({ error: "Destination and days are required" });
      return;
    }
    const itinerary = await generateItinerary(
      destination,
      Number(days),
      groupType || "Solo",
      theme || "Adventure"
    );
    res.json({ itinerary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const generateBudgetEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, days, people, budgetLevel } = req.body;
    if (!destination || !days || !people) {
      res.status(400).json({ error: "Destination, days, and people are required" });
      return;
    }
    const budget = await generateBudgetPlan(
      destination,
      Number(days),
      Number(people),
      budgetLevel || "Moderate"
    );
    res.json({ budget });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const chatAssistantEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const response = await chatTravelAssistant(history || [], message);
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getHotelDetailsEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelName } = req.body;
    if (!hotelName) {
      res.status(400).json({ error: "Hotel name is required" });
      return;
    }
    const dossier = await generateHotelDetails(hotelName);
    res.json({ dossier });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRouteDetailsEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, mode } = req.body;
    if (!origin || !destination) {
      res.status(400).json({ error: "Origin and Destination are required" });
      return;
    }
    const routeIntel = await generateRouteDetails(origin, destination, mode || "driving");
    res.json({ routeIntel });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
