import { getWidgetGroups } from '../../lib/helpers/area-widgets.js';

export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Default Page'
  },
  fields: {
    add: {
      main: {
        type: 'area',
        options: getWidgetGroups({
          includeLayouts: true
        })
      },
      // In your page-type or piece-type configuration
      _icon: {
        type: 'relationship',
        withType: '@apostrophecms/svg-sprite', // or whatever the module name is
        label: 'Choose an Icon',
        max: 1,
        builders: {
          project: {
            file: 1,
            svgId: 1
          }
        }
      },
      _theArticle: {
        type: 'relationship',
        withType: 'article',
        label: 'Chose article',
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'main'
        ]
      }
    }
  }
};
