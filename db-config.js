// Database Configuration - Secure Environment Variables
const DB_CONFIG = {
    // For production: set these in your hosting platform environment variables
    // For development: create a .env file with these values
    
    url: (typeof process !== 'undefined' && process?.env?.VITE_DATABASE_URL) ||
         // Production requires environment variables - no fallback for security
         (() => {
             console.error('VITE_DATABASE_URL environment variable not found. Please set it in your .env file or hosting platform.');
             return null;
         })(),
         
    key: (typeof process !== 'undefined' && process?.env?.VITE_DATABASE_ANON_KEY) ||
         // Production requires environment variables - no fallback for security  
         (() => {
             console.error('VITE_DATABASE_ANON_KEY environment variable not found. Please set it in your .env file or hosting platform.');
             return null;
         })()
};

// Validation - ensure we have valid configuration
if (!DB_CONFIG.url || !DB_CONFIG.key) {
    console.error('⚠️ Database configuration missing! Please check your environment variables.');
}

// Database table name - using your custom table name
const TABLE_NAME = 'webNews';

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DB_CONFIG, TABLE_NAME };
} else {
    window.DB_CONFIG = DB_CONFIG;
    window.TABLE_NAME = TABLE_NAME;
} 