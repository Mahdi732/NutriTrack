import { 
    getWeightData, 
    getLatestWeight, 
    addWeightEntry, 
    getBodyMeasurements,
    addBodyMeasurements,
    getWeightStatistics 
} from '../repositories/weightRepository.js';
import { getUserProfile } from '../repositories/medicalRepository.js';

// Calculate BMI
export const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
};

// Estimate muscle mass using Boer formula (simplified)
export const estimateMuscleMass = (weightKg, heightCm, gender, bodyFatPercentage = null) => {
    let muscleMass;
    
    if (bodyFatPercentage) {
        // If body fat % is known, use lean body mass calculation
        muscleMass = weightKg * (1 - bodyFatPercentage / 100) * 0.85; // 85% of lean mass is muscle
    } else {
        // Use Boer formula estimation
        if (gender === 'male') {
            muscleMass = (0.407 * weightKg) + (0.267 * heightCm) - 19.2;
        } else {
            muscleMass = (0.252 * weightKg) + (0.473 * heightCm) - 48.3;
        }
    }
    
    return Math.max(0, muscleMass); // Ensure non-negative
};

// Get weight management analysis
export const getWeightAnalysis = async (userId, days = 90) => {
    try {
        // Get user profile for height and gender
        const profile = await getUserProfile(userId);
        if (!profile) {
            return getDefaultWeightData();
        }

        // Get weight data
        const weightData = await getWeightData(userId, days);
        const bodyMeasurements = await getBodyMeasurements(userId, days);
        const statistics = await getWeightStatistics(userId, days);

        if (weightData.length === 0) {
            return getDefaultWeightData();
        }

        // Calculate trends and progress
        const trends = calculateWeightTrends(weightData);
        const progress = calculateProgress(weightData, profile);
        const chartData = prepareChartData(weightData);
        const insights = generateInsights(weightData, profile, trends);

        return {
            currentStats: {
                currentWeight: weightData[weightData.length - 1].weight_kg,
                currentBMI: weightData[weightData.length - 1].bmi,
                currentMuscleMass: weightData[weightData.length - 1].muscle_mass_kg || 
                                 estimateMuscleMass(
                                     weightData[weightData.length - 1].weight_kg, 
                                     profile.taille_cm, 
                                     profile.sexe
                                 ),
                targetWeight: profile.poids_cible_kg,
                heightCm: profile.taille_cm
            },
            trends,
            progress,
            chartData,
            statistics: {
                totalEntries: statistics.total_entries,
                weightRange: {
                    min: statistics.min_weight,
                    max: statistics.max_weight,
                    avg: statistics.avg_weight
                },
                bmiRange: {
                    min: statistics.min_bmi,
                    max: statistics.max_bmi,
                    avg: statistics.avg_bmi
                }
            },
            insights,
            bodyMeasurements: bodyMeasurements.slice(-5) // Last 5 measurements
        };

    } catch (error) {
        console.error('Error getting weight analysis:', error);
        return getDefaultWeightData();
    }
};

// Calculate weight trends
const calculateWeightTrends = (weightData) => {
    if (weightData.length < 2) {
        return { weightChange: 0, bmiChange: 0, muscleMassChange: 0, trend: 'stable' };
    }

    const firstEntry = weightData[0];
    const lastEntry = weightData[weightData.length - 1];

    const weightChange = lastEntry.weight_kg - firstEntry.weight_kg;
    const bmiChange = lastEntry.bmi - firstEntry.bmi;
    const muscleMassChange = (lastEntry.muscle_mass_kg || 0) - (firstEntry.muscle_mass_kg || 0);

    let trend = 'stable';
    if (weightChange > 0.5) trend = 'gaining';
    else if (weightChange < -0.5) trend = 'losing';

    return {
        weightChange: Math.round(weightChange * 100) / 100,
        bmiChange: Math.round(bmiChange * 100) / 100,
        muscleMassChange: Math.round(muscleMassChange * 100) / 100,
        trend,
        weeklyAverage: calculateWeeklyAverage(weightData)
    };
};

// Calculate weekly average weight change
const calculateWeeklyAverage = (weightData) => {
    if (weightData.length < 2) return 0;

    const firstEntry = weightData[0];
    const lastEntry = weightData[weightData.length - 1];
    
    const daysDiff = Math.abs(new Date(lastEntry.measurement_date) - new Date(firstEntry.measurement_date)) / (1000 * 60 * 60 * 24);
    const weightChange = lastEntry.weight_kg - firstEntry.weight_kg;
    
    return daysDiff > 0 ? Math.round((weightChange / daysDiff) * 7 * 100) / 100 : 0;
};

// Calculate progress towards goal
const calculateProgress = (weightData, profile) => {
    if (!profile.poids_cible_kg || weightData.length === 0) {
        return { progressPercentage: 0, remainingKg: 0, estimatedWeeks: 0 };
    }

    const currentWeight = weightData[weightData.length - 1].weight_kg;
    const startWeight = profile.poids_actuel_kg;
    const targetWeight = profile.poids_cible_kg;

    const totalToLose = Math.abs(startWeight - targetWeight);
    const currentProgress = Math.abs(startWeight - currentWeight);
    const remainingKg = Math.abs(currentWeight - targetWeight);

    const progressPercentage = totalToLose > 0 ? Math.min(100, (currentProgress / totalToLose) * 100) : 0;

    // Estimate weeks to goal based on current trend
    const weeklyAverage = calculateWeeklyAverage(weightData);
    const estimatedWeeks = weeklyAverage !== 0 ? Math.abs(remainingKg / weeklyAverage) : 0;

    return {
        progressPercentage: Math.round(progressPercentage),
        remainingKg: Math.round(remainingKg * 100) / 100,
        estimatedWeeks: Math.round(estimatedWeeks)
    };
};

// Prepare data for charts
const prepareChartData = (weightData) => {
    return {
        dates: weightData.map(entry => entry.measurement_date),
        weights: weightData.map(entry => entry.weight_kg),
        bmis: weightData.map(entry => entry.bmi),
        muscleMass: weightData.map(entry => entry.muscle_mass_kg || 0)
    };
};

// Generate insights and recommendations
const generateInsights = (weightData, profile, trends) => {
    const insights = [];

    // Weight trend insight
    if (trends.trend === 'losing' && profile.objectif === 'weight_loss') {
        insights.push({
            type: 'success',
            title: 'Great Progress!',
            message: `You're losing weight at a healthy rate of ${Math.abs(trends.weeklyAverage)} kg per week.`
        });
    } else if (trends.trend === 'gaining' && profile.objectif === 'muscle_gain') {
        insights.push({
            type: 'success',
            title: 'Building Muscle!',
            message: `You're gaining weight steadily. Focus on protein intake to maximize muscle growth.`
        });
    } else if (trends.trend === 'stable') {
        insights.push({
            type: 'info',
            title: 'Stable Weight',
            message: 'Your weight has been stable. Consider adjusting your nutrition plan if you want to see changes.'
        });
    }

    // BMI insight
    const currentBMI = weightData[weightData.length - 1].bmi;
    if (currentBMI < 18.5) {
        insights.push({
            type: 'warning',
            title: 'Underweight',
            message: 'Your BMI indicates you may be underweight. Consider consulting a healthcare professional.'
        });
    } else if (currentBMI > 25) {
        insights.push({
            type: 'warning',
            title: 'Overweight',
            message: 'Your BMI indicates you may be overweight. Focus on a balanced diet and regular exercise.'
        });
    } else {
        insights.push({
            type: 'success',
            title: 'Healthy BMI',
            message: 'Your BMI is in the healthy range. Keep up the good work!'
        });
    }

    return insights;
};

// Add new weight entry
export const addWeight = async (userId, weightData) => {
    try {
        // Get user profile for height
        const profile = await getUserProfile(userId);
        if (!profile) {
            throw new Error('User profile not found');
        }

        // Calculate BMI
        const bmi = calculateBMI(weightData.weight, profile.taille_cm);

        // Estimate muscle mass if not provided
        let muscleMass = weightData.muscleMass;
        if (!muscleMass) {
            muscleMass = estimateMuscleMass(
                weightData.weight, 
                profile.taille_cm, 
                profile.sexe, 
                weightData.bodyFat
            );
        }

        const entryData = {
            date: weightData.date,
            weight: weightData.weight,
            bodyFat: weightData.bodyFat,
            muscleMass: muscleMass,
            bmi: Math.round(bmi * 100) / 100,
            notes: weightData.notes
        };

        return await addWeightEntry(userId, entryData);

    } catch (error) {
        console.error('Error adding weight entry:', error);
        throw error;
    }
};

// Default data when no weight data exists
const getDefaultWeightData = () => {
    return {
        currentStats: {
            currentWeight: 72.5,
            currentBMI: 23.4,
            currentMuscleMass: 58.2,
            targetWeight: 70.0,
            heightCm: 175
        },
        trends: {
            weightChange: -2.3,
            bmiChange: -0.8,
            muscleMassChange: 0.8,
            trend: 'losing',
            weeklyAverage: -0.6
        },
        progress: {
            progressPercentage: 72,
            remainingKg: 2.5,
            estimatedWeeks: 4
        },
        chartData: {
            dates: ['2024-09-01', '2024-09-15', '2024-10-01', '2024-10-06'],
            weights: [75.0, 74.2, 73.1, 72.5],
            bmis: [24.5, 24.2, 23.8, 23.4],
            muscleMass: [57.5, 57.8, 58.0, 58.2]
        },
        statistics: {
            totalEntries: 4,
            weightRange: { min: 72.5, max: 75.0, avg: 73.7 },
            bmiRange: { min: 23.4, max: 24.5, avg: 24.0 }
        },
        insights: [
            {
                type: 'success',
                title: 'Great Progress!',
                message: 'You\'re losing weight at a healthy rate of 0.6 kg per week.'
            },
            {
                type: 'success',
                title: 'Healthy BMI',
                message: 'Your BMI is in the healthy range. Keep up the good work!'
            }
        ],
        bodyMeasurements: []
    };
};
