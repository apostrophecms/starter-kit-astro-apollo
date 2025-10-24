import { getWidgetGroups } from '../../lib/helpers/area-widgets.js';

export default {
  extend: '@apostrophecms/layout-column-widget',
  fields: {
    add: {
      content: {
        type: 'area',
        options: getWidgetGroups({
          includeLayouts: false
        })
      }
    }
  }
};
