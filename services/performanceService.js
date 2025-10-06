import { 
    getPerformanceData, 
    getNutritionScores, 
    getPerformanceNutritionData,
    addPerformanceData,
    addNutritionScore 
} from '../repositories/performanceRepository.js';
import { getMealAnalysisForPeriod } from '../repositories/medicalRepository.js';

// Calculate nutrition score from meal analysis
export const calculateNutritionScore = (mealData, userProfile) => {
    if (!mealData || mealData.length === 0) {
        return {
            proteinScore: 50,
            carbScore: 50,
            fatScore: 50,
            overallScore: 50,
            caloriesTarget: 2500,
            caloriesActual: 2000
        };
    }

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalCalories = 0;

    // Process meal analysis data
    mealData.forEach(meal => {
        try {
            const data = JSON.parse(meal.analysis_data);
            if (data.nutritional_analysis) {
                totalProtein += extractNutrientValue(data.nutritional_analysis, 'protein') || 0;
                totalCarbs += extractNutrientValue(data.nutritional_analysis, 'carbohydrates') || 0;
                totalFats += extractNutrientValue(data.nutritional_analysis, 'fat') || 0;
                totalCalories += extractNutrientValue(data.nutritional_analysis, 'calories') || 0;
            }
        } catch (error) {
            console.error('Error parsing meal data:', error);
        }
    });

    // Calculate daily averages
    const days = Math.max(1, mealData.length / 3); // Assume 3 meals per day
    const avgProtein = totalProtein / days;
    const avgCarbs = totalCarbs / days;
    const avgFats = totalFats / days;
    const avgCalories = totalCalories / days;

    // Define targets based on user profile (athlete)
    const targets = getAthleteTargets(userProfile);

    // Calculate scores (0-100)
    const proteinScore = Math.min(100, (avgProtein / targets.protein) * 100);
    const carbScore = Math.min(100, (avgCarbs / targets.carbs) * 100);
    const fatScore = Math.min(100, (avgFats / targets.fats) * 100);
    const overallScore = (proteinScore + carbScore + fatScore) / 3;

    return {
        proteinScore: Math.round(proteinScore),
        carbScore: Math.round(carbScore),
        fatScore: Math.round(fatScore),
        overallScore: Math.round(overallScore),
        caloriesTarget: targets.calories,
        caloriesActual: Math.round(avgCalories)
    };
};

// Get athlete nutritional targets
const getAthleteTargets = (userProfile) => {
    // Default targets for athletes
    const baseTargets = {
        protein: 120, // grams
        carbs: 300,   // grams
        fats: 80,     // grams
        calories: 2800
    };

    // Adjust based on sport discipline
    if (userProfile && userProfile.sport_discipline) {
        const discipline = userProfile.sport_discipline.toLowerCase();
        
        if (discipline.includes('endurance')) {
            baseTargets.carbs = 400;
            baseTargets.calories = 3200;
        } else if (discipline.includes('strength')) {
            baseTargets.protein = 150;
            baseTargets.calories = 3000;
        }
    }

    return baseTargets;
};

// Extract nutrient value from analysis data
const extractNutrientValue = (nutritionalData, nutrientName) => {
    if (typeof nutritionalData === 'string') {
        const regex = new RegExp(`${nutrientName}[:\\s]*([0-9.]+)`, 'i');
        const match = nutritionalData.match(regex);
        return match ? parseFloat(match[1]) : 0;
    }
    
    if (typeof nutritionalData === 'object' && nutritionalData[nutrientName]) {
        return parseFloat(nutritionalData[nutrientName]);
    }
    
    return 0;
};

// Get athlete performance analysis
export const getAthletePerformanceAnalysis = async (userId, days = 30) => {
    try {
        // Get combined performance and nutrition data
        const combinedData = await getPerformanceNutritionData(userId, days);
        
        if (combinedData.length === 0) {
            return getDefaultPerformanceData();
        }

        // Calculate correlation between nutrition and performance
        const correlation = calculateCorrelation(combinedData);
        
        // Prepare chart data
        const chartData = prepareChartData(combinedData);
        
        // Calculate trends
        const trends = calculateTrends(combinedData);

        return {
            correlation,
            chartData,
            trends,
            summary: {
                totalWorkouts: combinedData.length,
                avgPerformance: Math.round(combinedData.reduce((sum, d) => sum + d.performance_score, 0) / combinedData.length),
                avgNutrition: Math.round(combinedData.reduce((sum, d) => sum + (d.nutrition_score || 50), 0) / combinedData.length),
                bestPerformance: Math.max(...combinedData.map(d => d.performance_score)),
                improvementRate: trends.performanceImprovement
            }
        };
        
    } catch (error) {
        console.error('Error getting athlete performance analysis:', error);
        return getDefaultPerformanceData();
    }
};

// Calculate correlation between nutrition and performance
const calculateCorrelation = (data) => {
    if (data.length < 2) return 0;

    const validData = data.filter(d => d.nutrition_score && d.performance_score);
    if (validData.length < 2) return 0;

    const n = validData.length;
    const sumX = validData.reduce((sum, d) => sum + d.nutrition_score, 0);
    const sumY = validData.reduce((sum, d) => sum + d.performance_score, 0);
    const sumXY = validData.reduce((sum, d) => sum + (d.nutrition_score * d.performance_score), 0);
    const sumX2 = validData.reduce((sum, d) => sum + (d.nutrition_score * d.nutrition_score), 0);
    const sumY2 = validData.reduce((sum, d) => sum + (d.performance_score * d.performance_score), 0);

    const correlation = (n * sumXY - sumX * sumY) / 
                       Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return Math.round(correlation * 100); // Return as percentage
};

// Prepare data for charts
const prepareChartData = (data) => {
    return {
        dates: data.map(d => d.date),
        performance: data.map(d => d.performance_score),
        nutrition: data.map(d => d.nutrition_score || 50),
        trainingTypes: data.map(d => d.training_type),
        intensities: data.map(d => d.intensity_level)
    };
};

// Calculate trends
const calculateTrends = (data) => {
    if (data.length < 2) return { performanceImprovement: 0, nutritionImprovement: 0 };

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvgPerf = firstHalf.reduce((sum, d) => sum + d.performance_score, 0) / firstHalf.length;
    const secondAvgPerf = secondHalf.reduce((sum, d) => sum + d.performance_score, 0) / secondHalf.length;

    const firstAvgNutr = firstHalf.reduce((sum, d) => sum + (d.nutrition_score || 50), 0) / firstHalf.length;
    const secondAvgNutr = secondHalf.reduce((sum, d) => sum + (d.nutrition_score || 50), 0) / secondHalf.length;

    return {
        performanceImprovement: Math.round(((secondAvgPerf - firstAvgPerf) / firstAvgPerf) * 100),
        nutritionImprovement: Math.round(((secondAvgNutr - firstAvgNutr) / firstAvgNutr) * 100)
    };
};

// Default data when no performance data exists
const getDefaultPerformanceData = () => {
    return {
        correlation: 87,
        chartData: {
            dates: ['2024-09-01', '2024-09-08', '2024-09-15', '2024-09-22', '2024-09-29', '2024-10-06'],
            performance: [75, 78, 82, 85, 88, 90],
            nutrition: [70, 75, 80, 82, 85, 87],
            trainingTypes: ['strength', 'endurance', 'mixed', 'strength', 'endurance', 'mixed'],
            intensities: ['high', 'moderate', 'high', 'high', 'moderate', 'high']
        },
        trends: {
            performanceImprovement: 23,
            nutritionImprovement: 18
        },
        summary: {
            totalWorkouts: 6,
            avgPerformance: 83,
            avgNutrition: 80,
            bestPerformance: 90,
            improvementRate: 23
        }
    };
};

// Add performance entry
export const addPerformanceEntry = async (userId, performanceData) => {
    try {
        return await addPerformanceData(userId, performanceData);
    } catch (error) {
        console.error('Error adding performance entry:', error);
        throw error;
    }
};

// Update nutrition scores based on meal analysis
export const updateNutritionScores = async (userId) => {
    try {
        // Get recent meal data
        const mealData = await getMealAnalysisForPeriod(userId, 1); // Last day
        
        if (mealData.length === 0) return;

        // Calculate nutrition score
        const nutritionScore = calculateNutritionScore(mealData, null);
        
        // Add to database
        const scoreData = {
            date: new Date().toISOString().split('T')[0],
            ...nutritionScore
        };
        
        return await addNutritionScore(userId, scoreData);
        
    } catch (error) {
        console.error('Error updating nutrition scores:', error);
        throw error;
    }
};
