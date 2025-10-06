import express from 'express';
import { getWeeklyReport, getMedicalMetricsAPI, exportWeeklyReport } from '../controllers/rapportController.js';

const route = express.Router();

// Main weekly report page
route.get('/', getWeeklyReport);

// API endpoint for medical metrics
route.get('/api/metrics', getMedicalMetricsAPI);

// Export report functionality
route.get('/export', exportWeeklyReport);

export default route;