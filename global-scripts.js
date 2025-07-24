// ========== GLOBAL SITE MANAGEMENT & ERROR HANDLING ==========
// Site closure check
function checkSiteClosure() {
    const isClosed = localStorage.getItem('mthani-site-closed') === 'true';
    if (isClosed && !window.location.pathname.includes('dashboard.html') && !window.location.pathname.includes('wait-for-us.html')) {
        window.location.href = 'wait-for-us.html';
        return false;
    }
    return true;
}

// Global error handler (only for critical errors)
window.onerror = function(message, source, lineno, colno, error) {
    console.error('JavaScript Error:', { message, source, lineno, colno, error });
    // Only redirect on critical errors, not minor ones
    if (message.includes('Script error') || message.includes('Network Error') || message.includes('Cannot read property')) {
        setTimeout(() => {
            window.location.href = 'error.html?code=js&msg=' + encodeURIComponent(message);
        }, 3000); // Increased delay to avoid false positives
    }
    return false;
};

// Unhandled promise rejection handler (only for critical rejections)
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Only redirect on critical promise rejections
    if (event.reason && (event.reason.toString().includes('Network') || event.reason.toString().includes('Failed to fetch'))) {
        setTimeout(() => {
            window.location.href = 'error.html?code=promise&msg=' + encodeURIComponent(event.reason);
        }, 3000);
    }
});

// Note: Site closure check should be called within DOMContentLoaded event, not at top level

// Console security warning
console.log('%c⚠️ تحذير أمني شديد | SEVERE SECURITY WARNING ⚠️', 'color: #ff0000; font-size: 24px; font-weight: bold; background: #ffeeee; padding: 10px; border: 3px solid #ff0000;');
console.log('%c🚨 تحذير للمطورين المخوّلين فقط | DEVELOPERS ONLY WARNING 🚨', 'color: #ff0000; font-size: 20px; font-weight: bold; text-decoration: underline;');
console.log('%cجمعية مثاني القرآنية - محمية بموجب القانون السعودي', 'color: #ff0000; font-size: 16px; font-weight: bold;');
console.log('%c' + '='.repeat(60), 'color: #ff0000; font-weight: bold;'); 