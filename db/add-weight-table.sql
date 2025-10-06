-- Add weight tracking table for weight management users
USE nutrition_app;

CREATE TABLE IF NOT EXISTS weight_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    measurement_date DATE NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    body_fat_percentage DECIMAL(4,2) DEFAULT NULL, -- Optional body fat %
    muscle_mass_kg DECIMAL(5,2) DEFAULT NULL, -- Calculated or measured
    bmi DECIMAL(4,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weight_tracking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Add body measurements table for more detailed tracking
CREATE TABLE IF NOT EXISTS body_measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    measurement_date DATE NOT NULL,
    waist_cm DECIMAL(5,2) DEFAULT NULL,
    chest_cm DECIMAL(5,2) DEFAULT NULL,
    hip_cm DECIMAL(5,2) DEFAULT NULL,
    arm_cm DECIMAL(5,2) DEFAULT NULL,
    thigh_cm DECIMAL(5,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_body_measurements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
