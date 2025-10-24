import { getWidgetGroups } from '../../../lib/helpers/area-widgets.js';
const baseGroups = getWidgetGroups({ includeLayouts: false });

export default {
  fields(self, options) {
    return {
      add: {
        content: {
          type: 'area',
          label: 'Main Content',
          options: {
            ...baseGroups,
            groups: {
              layout: {
                label: 'Layout',
                columns: 2,
                widgets: {
                  'nested-layout': {}
                }
              },
              ...baseGroups.groups
            }
          }
        }
      }
    };
  }
};
