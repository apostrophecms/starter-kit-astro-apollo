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