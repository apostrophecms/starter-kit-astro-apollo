export default {
  // Showcase advanced extend tecnique for layout widget,
  // for custom layout with custom columns.
  extend: '@apostrophecms/layout-widget',
  options: {
    label: 'Nested Layout',
    columns: 6,
    minSpan: 2,
    defaultSpan: 3
  },
  fields: {
    add: {
      columns: {
        type: 'area',
        // The "special" options for the area will be auto applied.
        options: {
          widgets: {
            'nested-column': {}
          }
        }
      }
    }
  }
};
