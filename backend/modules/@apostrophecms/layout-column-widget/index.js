import { getWidgetGroups } from '../../../lib/helpers/area-widgets.js';

export default {
  fields(self, options) {
    return {
      add: {
        content: {
          type: 'area',
          label: 'Main Content',
          options: getWidgetGroups({
            includeLayouts: false
          })
        }
      }
    };
  }
};
