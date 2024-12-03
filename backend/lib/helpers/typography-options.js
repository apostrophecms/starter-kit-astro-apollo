const textOptionsHelper = {
  getTextSizes() {
    return [
      { label: 'Default', value: '' },
      { label: 'Size 1 (3rem)', value: 'is-size-1' },
      { label: 'Size 2 (2.5rem)', value: 'is-size-2' },
      { label: 'Size 3 (2rem)', value: 'is-size-3' },
      { label: 'Size 4 (1.5rem)', value: 'is-size-4' },
      { label: 'Size 5 (1.25rem)', value: 'is-size-5' },
      { label: 'Size 6 (1rem)', value: 'is-size-6' },
      { label: 'Size 7 (0.75rem)', value: 'is-size-7' }
    ];
  },

  getResponsiveSizes() {
    const sizes = ['1', '2', '3', '4', '5', '6', '7'];
    const breakpoints = ['mobile', 'tablet', 'desktop', 'widescreen'];

    const choices = [{ label: 'Default', value: '' }];

    breakpoints.forEach(breakpoint => {
      sizes.forEach(size => {
        choices.push({
          label: `Size ${size} (${breakpoint})`,
          value: `is-size-${size}-${breakpoint}`
        });
      });
    });

    return choices;
  },

  getTextWeights() {
    return [
      { label: 'Default', value: '' },
      { label: 'Light (300)', value: 'has-text-weight-light' },
      { label: 'Normal (400)', value: 'has-text-weight-normal' },
      { label: 'Medium (500)', value: 'has-text-weight-medium' },
      { label: 'Semi-Bold (600)', value: 'has-text-weight-semibold' },
      { label: 'Bold (700)', value: 'has-text-weight-bold' }
    ];
  },

  getTextTransforms() {
    return [
      { label: 'Default', value: '' },
      { label: 'Capitalized', value: 'is-capitalized' },
      { label: 'Lowercase', value: 'is-lowercase' },
      { label: 'Uppercase', value: 'is-uppercase' },
      { label: 'Italic', value: 'is-italic' }
    ];
  },

  getTextAlignments() {
    return [
      { label: 'Default', value: '' },
      { label: 'Left', value: 'has-text-left' },
      { label: 'Centered', value: 'has-text-centered' },
      { label: 'Right', value: 'has-text-right' },
      { label: 'Justified', value: 'has-text-justified' }
    ];
  }
};

export default textOptionsHelper;
