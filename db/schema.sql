-- 1. Create the database
CREATE DATABASE IF NOT EXISTS nutrition_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutrition_app;

-- 2. Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Profiles table
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sexe ENUM('male', 'female') NOT NULL,
    taille_cm DECIMAL(5,2) NOT NULL,
    poids_actuel_kg DECIMAL(5,2) NOT NULL,
    poids_cible_kg DECIMAL(5,2) DEFAULT NULL,
    niveau_activite ENUM('low', 'moderate', 'high') DEFAULT NULL,
    sport_discipline VARCHAR(100) DEFAULT NULL,
    duree_moyenne_min INT DEFAULT NULL,
    depense_energetique DECIMAL(8,2) DEFAULT NULL,
    objectif ENUM('weight_loss', 'muscle_gain', 'maintenance', 'performance') DEFAULT NULL,
    type_pathologie ENUM('none', 'diabetes', 'hypertension', 'obesity') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Meal Analysis table (JSON only)
CREATE TABLE meal_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    analysis_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_meal_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Recommendations table (JSON only)
CREATE TABLE recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recommendation_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Weekly Reports table (JSON only)
CREATE TABLE weekly_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weekly_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
