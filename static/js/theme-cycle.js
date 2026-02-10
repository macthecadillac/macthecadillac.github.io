document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    if (!themeSwitcher) return;

    const modes = ['light', 'dark', 'system'];
    
    // Intercept the click on the theme switcher
    themeSwitcher.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the dropdown from opening
        
        // Get current theme from local storage or data attribute
        let currentTheme = localStorage.getItem('theme') || 'system';
        
        // Find the next theme in the cycle
        let currentIndex = modes.indexOf(currentTheme);
        let nextIndex = (currentIndex + 1) % modes.length;
        let nextTheme = modes[nextIndex];

        // Apply the theme (This mimics Duckquill's internal function)
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        
        // Optional: Dispatch an event if the theme's other JS needs to know
        window.dispatchEvent(new Event('storage'));
        
        console.log(`Theme cycled to: ${nextTheme}`);
    });
});
