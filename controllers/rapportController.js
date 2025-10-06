import { calculateMedicalMetrics, saveWeeklyReport } from '../services/medicalService.js';

// Get weekly medical report for a user
export const getWeeklyReport = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 7; // Default to 7 days
        
        // Calculate medical metrics from meal analysis data
        const medicalData = await calculateMedicalMetrics(userId, days);
        
        // Get additional user data for context
        const reportData = {
            period: `Last ${days} Days`,
            medicalTracking: medicalData,
            generatedAt: new Date().toISOString(),
            userId: userId
        };
        
        // Save the report to database for future reference
        await saveWeeklyReport(userId, reportData);
        
        // Return the data for the view
        res.render('rapport', {
            user: req.session.user,
            reportData: reportData,
            medicalData: medicalData
        });
        
    } catch (error) {
        console.error('Error generating weekly report:', error);
        res.status(500).render('error', {
            message: 'Error generating weekly report',
            error: error
        });
    }
};

// Get medical metrics as JSON (for API calls)
export const getMedicalMetricsAPI = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 7;
        
        const medicalData = await calculateMedicalMetrics(userId, days);
        
        res.json({
            success: true,
            data: medicalData
        });
        
    } catch (error) {
        console.error('Error getting medical metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving medical metrics'
        });
    }
};

// Export weekly report data
export const exportWeeklyReport = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const days = parseInt(req.query.days) || 7;
        
        const medicalData = await calculateMedicalMetrics(userId, days);
        
        // Create export data
        const exportData = {
            user: req.session.user.full_name,
            period: `Last ${days} Days`,
            generatedAt: new Date().toISOString(),
            saltSugarTracking: {
                averageSaltIntake: `${medicalData.saltSugar.currentSalt.toFixed(1)}g`,
                saltLimit: `${medicalData.saltSugar.saltLimit}g`,
                saltExcess: `${medicalData.saltSugar.saltExcess.toFixed(1)}g`,
                averageSugarIntake: `${medicalData.saltSugar.currentSugar.toFixed(1)}g`,
                sugarLimit: `${medicalData.saltSugar.sugarLimit}g`,
                sugarExcess: `${medicalData.saltSugar.sugarExcess.toFixed(1)}g`
            },
            glycemicTracking: {
                averageGlucose: `${medicalData.glycemic.average} mg/dL`,
                lowestReading: `${medicalData.glycemic.lowest} mg/dL`,
                highestReading: `${medicalData.glycemic.highest} mg/dL`,
                withinNormalRange: medicalData.glycemic.isInNormalRange
            },
            recommendations: medicalData.recommendations
        };
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="medical-report-${Date.now()}.json"`);
        
        res.json(exportData);
        
    } catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting report'
        });
    }
};
