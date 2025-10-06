import fs from 'fs';

// Read current .env file
let envContent = '';
try {
    envContent = fs.readFileSync('.env', 'utf8');
} catch (error) {
    console.log('Creating new .env file...');
}

// Update or add database configuration
const newConfig = `PORT=3000
SESSION_SECRET=nutritrack-secret-key-change-this-in-production

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=nutrition_app

# Gemini API (for meal analysis)
GEMINI_API_KEY=your-gemini-api-key-here
`;

fs.writeFileSync('.env', newConfig);
console.log('✅ .env file updated with correct database settings');
console.log('Database password: 123456');
