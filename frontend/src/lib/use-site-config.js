/**
 * @typedef {Object} BrandingGroup
 * @property {string} [brandingType] - Display type for branding ('logo'|'text'|'both')
 * @property {string} [mobileDisplayPreference] - Mobile display preference ('same'|'logo'|'text'|'both')
 * @property {Object} [siteLogo] - Site logo configuration
 * @property {Object} [siteLogo._urls] - URLs for different logo sizes
 * @property {string} [siteLogo._urls.max] - URL for maximum size logo
 * @property {string} [siteTitle] - Site title text
 * @property {string} [siteTextSize] - Text size class for site title
 * @property {number} [logoMaxHeight] - Maximum height for logo in pixels
 */

/**
 * @typedef {Object} HeaderGroup
 * @property {string} [headerPosition] - Header position type ('fixed'|'fixed-fade')
 * @property {string} [spacing] - CSS spacing class
 * @property {string} [headerBackgroundColor] - Background color class name
 * @property {string} [headerTextColor] - Text color class name
 * @property {string} [dropdownTextColor] - Dropdown text color class name
 * @property {string} [headerActiveColor] - Active item background color class name
 * @property {string} [headerHoverColor] - Hover color class name
 * @property {number} [transparency] - Header transparency value (0-100)
 */

/**
 * @typedef {Object} GlobalData
 * @property {BrandingGroup} [brandingGroup] - Branding configuration
 * @property {HeaderGroup} [headerGroup] - Header configuration
 */

/**
 * Custom hook for managing site configuration and styling
 * @param {GlobalData} globalData - Global site configuration data
 * @returns {Object} Configuration utility functions
 * @property {function(): string} getHeaderClasses - Get header CSS classes
 * @property {function(): number} getHeaderTransparency - Get header transparency value
 * @property {function(boolean): string} getNavItemClasses - Get navigation item CSS classes
 * @property {function(): string} getDropdownClasses - Get dropdown CSS classes
 * @property {function(boolean): string} renderBranding - Render branding HTML
 */
export function useSiteConfig(globalData) {
  const brandingGroup = globalData?.brandingGroup || {};
  const headerGroup = globalData?.headerGroup || {};

  const getHeaderClasses = () => {
    const classes = ['navbar'];

    // Add position class based on headerMode or headerPosition
    const headerPosition = headerGroup.headerPosition;

    if (headerPosition === 'fixed') {
      classes.push('is-fixed-top'); // Bulma's fixed top class
    } else if (headerPosition === 'fixed-fade') {
      classes.push('is-fixed-top', 'is-fixed-fade');
    }

    // Add spacing class
    if (headerGroup.spacing) {
      classes.push(headerGroup.spacing);
    }

    // Add background color
    if (headerGroup.headerBackgroundColor) {
      classes.push(`has-background-${headerGroup.headerBackgroundColor}`);
    }

    // Add text color
    if (headerGroup.headerTextColor) {
      classes.push(`has-text-${headerGroup.headerTextColor}`);
    }

    return classes.join(' ');
  };


  const getHeaderTransparency = () => {
    if (headerGroup.transparency) {
      return headerGroup.transparency;
    };
    return 100;
  }

  const getNavItemClasses = (isActive = false) => {
    const classes = ['navbar-item'];

    if (headerGroup.dropdownTextColor) {
      classes.push(`has-text-${headerGroup.dropdownTextColor}`);
    }

    if (headerGroup.headerBackgroundColor) {
      classes.push(`has-background-${headerGroup.headerBackgroundColor}`);
    }

    if (isActive) {
      classes.push('is-active');
      if (headerGroup.headerActiveColor) {
        classes.push(`has-background-${headerGroup.headerActiveColor}`);
      }
    }

    // Add hover classes via data attribute for CSS handling
    if (headerGroup.headerHoverColor) {
      classes.push(`hover-color-${headerGroup.headerHoverColor}`);
    }

    return classes.join(' ');
  };

  const getDropdownClasses = () => {
    const classes = ['navbar-dropdown'];
    if (headerGroup.dropdownTextColor) {
      classes.push(`has-text-${headerGroup.dropdownTextColor}`);
    }

    if (headerGroup.headerBackgroundColor) {
      classes.push(`has-background-${headerGroup.headerBackgroundColor}`);
    }

    return classes.join(' ');
  };

  const renderBranding = (isMobile = false) => {
    const displayType = isMobile && brandingGroup.mobileDisplayPreference !== 'same'
      ? brandingGroup.mobileDisplayPreference
      : brandingGroup.brandingType;

    const elements = [];

    // Add logo if needed
    if (displayType === 'logo' || displayType === 'both') {
      if (brandingGroup.siteLogo?._urls?.max) {
        elements.push(
          `<img
            src="${brandingGroup.siteLogo._urls.max}" 
            alt="${brandingGroup.siteTitle}"
            style="max-height: ${brandingGroup.logoMaxHeight || 40}px"
            class="navbar-brand-logo"
          />`
        );
      }
    }

    // Add text if needed
    if (displayType === 'text' || displayType === 'both') {
      elements.push(
        `<span class="navbar-brand-text ${brandingGroup.siteTextSize || 'is-size-4'} has-text-${headerGroup.headerTextColor}">
          ${brandingGroup.siteTitle}
        </span>`
      );
    }

    return elements.join('');
  };

  return {
    getHeaderClasses,
    getHeaderTransparency,
    getNavItemClasses,
    getDropdownClasses,
    renderBranding
  };
}