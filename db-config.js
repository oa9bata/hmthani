// Database Configuration - Secure Environment Variables
const DB_CONFIG = {
    // These will be automatically populated from environment variables
    // For development: copy from .env file  
    // For production: set in hosting platform (Vercel, Netlify, etc.)
    
    // Try to get from build-time environment variables first (for build tools like Vite, Next.js)
    url: (typeof process !== 'undefined' && process?.env?.VITE_DATABASE_URL) ||
         // Fallback for static hosting - you can set these directly for production
         'https://hzqvcosfhrzkygovtyyk.supabase.co',
         
    key: (typeof process !== 'undefined' && process?.env?.VITE_DATABASE_ANON_KEY) ||
         // Fallback for static hosting - you can set these directly for production  
         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cXZjb3NmaHJ6a3lnb3Z0eXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjYwMDgsImV4cCI6MjA2ODk0MjAwOH0.cqwjd-fA9JxE1cgiB1jO9MKBePiS0sjr_pVTuSBvceQ'
};

// Database table name - using your custom table name
const TABLE_NAME = 'webNews';

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DB_CONFIG, TABLE_NAME };
} else {
    window.DB_CONFIG = DB_CONFIG;
    window.TABLE_NAME = TABLE_NAME;
} 