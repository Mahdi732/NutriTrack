import { getAthletePerformanceAnalysis, addPerformanceEntry, updateNutritionScores } from '../services/performanceService.js';

// Show athlete performance page
export const showPerformancePage = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 30;
        
        // Get performance analysis data
        const performanceData = await getAthletePerformanceAnalysis(userId, days);
        
        res.render('performance', {
            user: req.session.user,
            performanceData: performanceData,
            selectedPeriod: days
        });
        
    } catch (error) {
        console.error('Error showing performance page:', error);
        res.status(500).render('error', {
            message: 'Error loading performance data',
            error: error
        });
    }
};

// Add new performance entry
export const addPerformance = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { date, score, trainingType, duration, intensity, notes } = req.body;
        
        // Validate input
        if (!date || !score || !trainingType || !duration || !intensity) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        
        // Validate score range
        if (score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: 'Performance score must be between 0 and 100'
            });
        }
        
        const performanceData = {
            date,
            score: parseFloat(score),
            trainingType,
            duration: parseInt(duration),
            intensity,
            notes
        };
        
        const performanceId = await addPerformanceEntry(userId, performanceData);
        
        // Update nutrition scores for the same day
        await updateNutritionScores(userId);
        
        res.json({
            success: true,
            message: 'Performance data added successfully',
            performanceId: performanceId
        });
        
    } catch (error) {
        console.error('Error adding performance data:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding performance data'
        });
    }
};

// Get performance data as JSON
export const getPerformanceData = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 30;
        
        const performanceData = await getAthletePerformanceAnalysis(userId, days);
        
        res.json({
            success: true,
            data: performanceData
        });
        
    } catch (error) {
        console.error('Error getting performance data:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving performance data'
        });
    }
};

// Show add performance form
export const showAddPerformanceForm = (req, res) => {
    res.render('add-performance', {
        user: req.session.user,
        error: null
    });
};
