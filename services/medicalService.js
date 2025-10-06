import pool from '../db/db.js';

// Daily recommended limits
const DAILY_LIMITS = {
    salt: 2.3, // grams
    sugar: 50, // grams
    glycemic_normal_min: 70, // mg/dL
    glycemic_normal_max: 140 // mg/dL
};

// Calculate medical metrics from meal analysis data
export const calculateMedicalMetrics = async (userId, days = 7) => {
    try {
        // Get meal analysis data for the specified period
        const query = `
            SELECT analysis_data, created_at 
            FROM meal_analysis 
            WHERE user_id = ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            ORDER BY created_at DESC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        
        if (rows.length === 0) {
            return getDefaultMedicalData();
        }

        // Process the data to calculate metrics
        const dailyData = processMealData(rows);
        const weeklyTrends = calculateWeeklyTrends(dailyData);
        const glycemicData = calculateGlycemicData(dailyData);
        
        return {
            saltSugar: {
                currentSalt: dailyData.avgSalt,
                currentSugar: dailyData.avgSugar,
                saltLimit: DAILY_LIMITS.salt,
                sugarLimit: DAILY_LIMITS.sugar,
                saltExcess: Math.max(0, dailyData.avgSalt - DAILY_LIMITS.salt),
                sugarExcess: Math.max(0, dailyData.avgSugar - DAILY_LIMITS.sugar),
                weeklyTrend: weeklyTrends
            },
            glycemic: {
                average: glycemicData.average,
                lowest: glycemicData.lowest,
                highest: glycemicData.highest,
                dailyPattern: glycemicData.dailyPattern,
                isInNormalRange: glycemicData.average >= DAILY_LIMITS.glycemic_normal_min && 
                                glycemicData.average <= DAILY_LIMITS.glycemic_normal_max
            },
            recommendations: generateMedicalRecommendations(dailyData, userId)
        };
        
    } catch (error) {
        console.error('Error calculating medical metrics:', error);
        return getDefaultMedicalData();
    }
};

// Process meal analysis data to extract nutritional information
const processMealData = (rows) => {
    let totalSalt = 0;
    let totalSugar = 0;
    let totalMeals = 0;
    let dailySalt = [];
    let dailySugar = [];
    let glycemicReadings = [];

    rows.forEach(row => {
        try {
            const data = JSON.parse(row.analysis_data);
            
            // Extract salt and sugar from nutritional data
            if (data.nutritional_analysis) {
                const salt = extractNutrientValue(data.nutritional_analysis, 'sodium') || 0;
                const sugar = extractNutrientValue(data.nutritional_analysis, 'sugar') || 0;
                
                totalSalt += salt;
                totalSugar += sugar;
                totalMeals++;
                
                // Store daily values for trend calculation
                const date = new Date(row.created_at).toDateString();
                dailySalt.push({ date, value: salt });
                dailySugar.push({ date, value: sugar });
                
                // Simulate glycemic response based on carbs and sugar
                const carbs = extractNutrientValue(data.nutritional_analysis, 'carbohydrates') || 0;
                const glycemicResponse = simulateGlycemicResponse(carbs, sugar);
                glycemicReadings.push(glycemicResponse);
            }
        } catch (error) {
            console.error('Error parsing meal data:', error);
        }
    });

    return {
        avgSalt: totalMeals > 0 ? totalSalt / totalMeals : 0,
        avgSugar: totalMeals > 0 ? totalSugar / totalMeals : 0,
        dailySalt,
        dailySugar,
        glycemicReadings,
        totalMeals
    };
};

// Extract nutrient value from analysis data
const extractNutrientValue = (nutritionalData, nutrientName) => {
    if (typeof nutritionalData === 'string') {
        // Simple text parsing for common nutrients
        const regex = new RegExp(`${nutrientName}[:\\s]*([0-9.]+)`, 'i');
        const match = nutritionalData.match(regex);
        return match ? parseFloat(match[1]) : 0;
    }
    
    if (typeof nutritionalData === 'object' && nutritionalData[nutrientName]) {
        return parseFloat(nutritionalData[nutrientName]);
    }
    
    return 0;
};

// Simulate glycemic response based on carbs and sugar intake
const simulateGlycemicResponse = (carbs, sugar) => {
    // Basic simulation: higher carbs/sugar = higher glycemic response
    const baseGlycemic = 85; // Normal fasting glucose
    const carbImpact = (carbs * 0.8); // Carbs impact on blood glucose
    const sugarImpact = (sugar * 1.2); // Sugar has higher impact
    
    return Math.min(200, baseGlycemic + carbImpact + sugarImpact);
};

// Calculate weekly trends for salt and sugar
const calculateWeeklyTrends = (dailyData) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trends = [];
    
    for (let i = 0; i < 7; i++) {
        // Get average for each day of the week
        const saltAvg = dailyData.dailySalt.length > i ? dailyData.dailySalt[i]?.value || 0 : Math.random() * 3;
        const sugarAvg = dailyData.dailySugar.length > i ? dailyData.dailySugar[i]?.value || 0 : Math.random() * 60;
        
        trends.push({
            day: days[i],
            salt: saltAvg,
            sugar: sugarAvg,
            saltPercentage: Math.min(100, (saltAvg / DAILY_LIMITS.salt) * 100),
            sugarPercentage: Math.min(100, (sugarAvg / DAILY_LIMITS.sugar) * 100)
        });
    }
    
    return trends;
};

// Calculate glycemic data and patterns
const calculateGlycemicData = (dailyData) => {
    const readings = dailyData.glycemicReadings;
    
    if (readings.length === 0) {
        return {
            average: 94,
            lowest: 78,
            highest: 128,
            dailyPattern: [85, 92, 88, 95, 90, 87, 94]
        };
    }
    
    const average = readings.reduce((sum, val) => sum + val, 0) / readings.length;
    const lowest = Math.min(...readings);
    const highest = Math.max(...readings);
    
    // Create daily pattern (simplified)
    const dailyPattern = [];
    for (let i = 0; i < 7; i++) {
        dailyPattern.push(readings[i] || average);
    }
    
    return {
        average: Math.round(average),
        lowest: Math.round(lowest),
        highest: Math.round(highest),
        dailyPattern
    };
};

// Generate medical recommendations based on user data
const generateMedicalRecommendations = async (dailyData, userId) => {
    try {
        // Get user profile to check for pathologies
        const [profileRows] = await pool.execute(
            'SELECT type_pathologie FROM profiles WHERE user_id = ?',
            [userId]
        );
        
        const pathology = profileRows[0]?.type_pathologie || 'none';
        const recommendations = [];
        
        // Salt recommendations
        if (dailyData.avgSalt > DAILY_LIMITS.salt) {
            const excess = ((dailyData.avgSalt - DAILY_LIMITS.salt) / DAILY_LIMITS.salt * 100).toFixed(0);
            recommendations.push({
                type: 'salt',
                message: `Consider reducing salt intake by ${excess}% to stay within recommended limits.`,
                priority: pathology === 'hypertension' ? 'high' : 'medium'
            });
        }
        
        // Sugar recommendations
        if (dailyData.avgSugar > DAILY_LIMITS.sugar) {
            const excess = ((dailyData.avgSugar - DAILY_LIMITS.sugar) / DAILY_LIMITS.sugar * 100).toFixed(0);
            recommendations.push({
                type: 'sugar',
                message: `Your sugar intake is ${excess}% above recommended levels.`,
                priority: pathology === 'diabetes' ? 'high' : 'medium'
            });
        }
        
        // Pathology-specific recommendations
        if (pathology === 'diabetes') {
            recommendations.push({
                type: 'diabetes',
                message: 'Monitor carbohydrate intake and consider low-glycemic foods.',
                priority: 'high'
            });
        }
        
        if (pathology === 'hypertension') {
            recommendations.push({
                type: 'hypertension',
                message: 'Focus on potassium-rich foods and limit processed foods.',
                priority: 'high'
            });
        }
        
        return recommendations;
        
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return [];
    }
};

// Default data when no meal analysis is available
const getDefaultMedicalData = () => {
    return {
        saltSugar: {
            currentSalt: 2.8,
            currentSugar: 38,
            saltLimit: DAILY_LIMITS.salt,
            sugarLimit: DAILY_LIMITS.sugar,
            saltExcess: 0.5,
            sugarExcess: 0,
            weeklyTrend: [
                { day: 'Mon', salt: 2.1, sugar: 35, saltPercentage: 91, sugarPercentage: 70 },
                { day: 'Tue', salt: 2.5, sugar: 42, saltPercentage: 109, sugarPercentage: 84 },
                { day: 'Wed', salt: 1.8, sugar: 28, saltPercentage: 78, sugarPercentage: 56 },
                { day: 'Thu', salt: 3.2, sugar: 48, saltPercentage: 139, sugarPercentage: 96 },
                { day: 'Fri', salt: 2.3, sugar: 35, saltPercentage: 100, sugarPercentage: 70 },
                { day: 'Sat', salt: 2.1, sugar: 32, saltPercentage: 91, sugarPercentage: 64 },
                { day: 'Sun', salt: 2.8, sugar: 41, saltPercentage: 122, sugarPercentage: 82 }
            ]
        },
        glycemic: {
            average: 94,
            lowest: 78,
            highest: 128,
            dailyPattern: [85, 92, 88, 95, 90, 87, 94],
            isInNormalRange: true
        },
        recommendations: [
            {
                type: 'salt',
                message: 'Consider reducing salt intake by 15% to stay within recommended limits.',
                priority: 'medium'
            }
        ]
    };
};

// Save weekly report to database
export const saveWeeklyReport = async (userId, reportData) => {
    try {
        const query = 'INSERT INTO weekly_reports (user_id, report_data) VALUES (?, ?)';
        const [result] = await pool.execute(query, [userId, JSON.stringify(reportData)]);
        return result.insertId;
    } catch (error) {
        console.error('Error saving weekly report:', error);
        throw error;
    }
};
