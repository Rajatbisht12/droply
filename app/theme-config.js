// File: app/theme-config.js
// Optional - You can create a theme configuration file to store theme settings

/**
 * Theme configuration for next-themes
 * @see https://github.com/pacocoursey/next-themes#options
 */
export const themeConfig = {
    // This attribute is used to set the data-theme attribute
    attribute: 'data-theme',
    
    // Default theme when first loading the page
    defaultTheme: 'dark',
    
    // Enable system theme detection
    enableSystem: true,
    
    // Disable CSS transitions when switching themes
    disableTransitionOnChange: false,
    
    // You can specify which themes are available
    // themes: ['light', 'dark', 'system'],
  }