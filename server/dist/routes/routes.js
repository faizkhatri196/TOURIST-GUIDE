import { Router } from 'express';
import { register, login, getProfile, toggleFavorite, toggleVisited, getPlaces, getPlaceByName, addReview, generateItineraryEndpoint, generateBudgetEndpoint, chatAssistantEndpoint, getHotelDetailsEndpoint, getRouteDetailsEndpoint, getSuperIntelEndpoint, upgradeToPremium } from '../controllers/controllers.js';
import { verifyToken } from '../middleware/auth.js';
const router = Router();
// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', verifyToken, getProfile);
router.post('/auth/favorite', verifyToken, toggleFavorite);
router.post('/auth/visited', verifyToken, toggleVisited);
router.post('/auth/upgrade', verifyToken, upgradeToPremium);
// Places Routes
router.get('/places', getPlaces);
router.get('/places/:name', getPlaceByName);
router.post('/places/:id/reviews', verifyToken, addReview);
// AI Planning Routes
router.post('/ai/itinerary', generateItineraryEndpoint);
router.post('/ai/budget', generateBudgetEndpoint);
router.post('/ai/chat', chatAssistantEndpoint);
router.post('/ai/hotel-details', getHotelDetailsEndpoint);
router.post('/ai/route-details', getRouteDetailsEndpoint);
router.post('/ai/super-intel', getSuperIntelEndpoint);
export default router;
