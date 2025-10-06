import express from 'express';
import { 
    showPerformancePage, 
    addPerformance, 
    getPerformanceData, 
    showAddPerformanceForm 
} from '../controllers/performanceController.js';

const route = express.Router();

// Main performance page
route.get('/', showPerformancePage);

// Add performance entry
route.post('/add', addPerformance);

// Get performance data as JSON
route.get('/api/data', getPerformanceData);

// Show add performance form (if needed as separate page)
route.get('/add-form', showAddPerformanceForm);

export default route;
