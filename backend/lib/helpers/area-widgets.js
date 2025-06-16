// Define our available widgets grouped by type
export const widgetGroups = {
  // Layout widgets are structural elements that help organize content
  layout: {
    label: 'Layout',
    columns: 2,
    widgets: {
      'grid-layout': {},
      rows: {}
    }
  },
  // Content widgets are the actual content elements users can add
  content: {
    label: 'Content',
    columns: 3,
    widgets: {
      '@apostrophecms/image': {},
      '@apostrophecms/video': {},
      '@apostrophecms/rich-text': {},
      slideshow: {},
      hero: {},
      accordion: {},
      card: {},
      link: {}
    }
  }
};

/**
 * Creates the groups configuration for ApostropheCMS widget areas
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeLayouts - If true, includes layout widgets in the groups
 * @param {Array<string>} options.exclude - Array of widget names to exclude
 * @returns {Object} Returns the groups configuration object
 * 
 * @example
 * // In your page type or piece type:
 * fields: {
 *   add: {
 *     main: {
 *       type: 'area',
 *       options: {
 *         // Get grouped widgets configuration
 *         ...getWidgetGroups({
 *           includeLayouts: true,
 *           exclude: ['hero']
 *         }),
 *         // Add any additional area options
 *         max: 10,
 *         min: 1
 *       }
 *     }
 *   }
 * }
 */
export const getWidgetGroups = ({
  includeLayouts = false,
  exclude = []
} = {}) => {
  // Initialize our groups object
  const groups = {};

  // Add layout widgets if requested
  if (includeLayouts) {
    groups.layout = {
      ...widgetGroups.layout,
      // Filter out any excluded widgets
      widgets: Object.fromEntries(
        Object.entries(widgetGroups.layout.widgets)
          .filter(([key]) => !exclude.includes(key))
      )
    };
  }

  // Always add content widgets
  groups.content = {
    ...widgetGroups.content,
    // Filter out any excluded widgets
    widgets: Object.fromEntries(
      Object.entries(widgetGroups.content.widgets)
        .filter(([key]) => !exclude.includes(key))
    )
  };

  // Return just the expanded and groups properties
  // This allows other area options to be spread alongside it
  return {
    expanded: true,
    groups
  };
};
