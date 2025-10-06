import express from 'express';
import { 
    showWeightPage, 
    addWeightEntry, 
    getWeightData 
} from '../controllers/weightController.js';

const route = express.Router();

// Main weight management page
route.get('/', showWeightPage);

// Add weight entry
route.post('/add', addWeightEntry);

// Get weight data as JSON
route.get('/api/data', getWeightData);

export default route;
