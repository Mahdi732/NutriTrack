-- Add performance tracking table for athletes
USE nutrition_app;

CREATE TABLE IF NOT EXISTS athlete_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    performance_date DATE NOT NULL,
    performance_score DECIMAL(5,2) NOT NULL, -- Performance score out of 100
    training_type VARCHAR(50) NOT NULL, -- 'endurance', 'strength', 'mixed'
    duration_minutes INT NOT NULL,
    intensity_level ENUM('low', 'moderate', 'high') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_athlete_performance_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Add nutritional score tracking
CREATE TABLE IF NOT EXISTS nutrition_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score_date DATE NOT NULL,
    protein_score DECIMAL(5,2) DEFAULT 0, -- Out of 100
    carb_score DECIMAL(5,2) DEFAULT 0, -- Out of 100
    fat_score DECIMAL(5,2) DEFAULT 0, -- Out of 100
    overall_score DECIMAL(5,2) DEFAULT 0, -- Out of 100
    calories_target INT DEFAULT 0,
    calories_actual INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nutrition_scores_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
