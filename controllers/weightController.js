import { getWeightAnalysis, addWeight } from '../services/weightService.js';

// Show weight management page
export const showWeightPage = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 90;
        
        // Get weight analysis data
        const weightData = await getWeightAnalysis(userId, days);
        
        res.render('weight', {
            user: req.session.user,
            weightData: weightData,
            selectedPeriod: days
        });
        
    } catch (error) {
        console.error('Error showing weight page:', error);
        res.status(500).render('error', {
            message: 'Error loading weight data',
            error: error
        });
    }
};

// Add new weight entry
export const addWeightEntry = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { date, weight, bodyFat, muscleMass, notes } = req.body;
        
        // Validate input
        if (!date || !weight) {
            return res.status(400).json({
                success: false,
                message: 'Date and weight are required'
            });
        }
        
        // Validate weight range
        if (weight < 20 || weight > 300) {
            return res.status(400).json({
                success: false,
                message: 'Weight must be between 20 and 300 kg'
            });
        }
        
        // Validate body fat percentage if provided
        if (bodyFat && (bodyFat < 0 || bodyFat > 50)) {
            return res.status(400).json({
                success: false,
                message: 'Body fat percentage must be between 0 and 50%'
            });
        }
        
        const weightData = {
            date,
            weight: parseFloat(weight),
            bodyFat: bodyFat ? parseFloat(bodyFat) : null,
            muscleMass: muscleMass ? parseFloat(muscleMass) : null,
            notes
        };
        
        const weightId = await addWeight(userId, weightData);
        
        res.json({
            success: true,
            message: 'Weight entry added successfully',
            weightId: weightId
        });
        
    } catch (error) {
        console.error('Error adding weight entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding weight entry'
        });
    }
};

// Get weight data as JSON
export const getWeightData = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 90;
        
        const weightData = await getWeightAnalysis(userId, days);
        
        res.json({
            success: true,
            data: weightData
        });
        
    } catch (error) {
        console.error('Error getting weight data:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving weight data'
        });
    }
};
