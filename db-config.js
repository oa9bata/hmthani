// Database Configuration - Hardcoded for static hosting
const DB_CONFIG = {
    url: 'https://hzqvcosfhrzkygovtyyk.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cXZjb3NmaHJ6a3lnb3Z0eXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjYwMDgsImV4cCI6MjA2ODk0MjAwOH0.cqwjd-fA9JxE1cgiB1jO9MKBePiS0sjr_pVTuSBvceQ'
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