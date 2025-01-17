import { getWidgetGroups } from '../../lib/helpers/area-widgets.js';

export default {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'Article Page',
    perPage: 7,
    piecesFilters: [
      {
        name: 'category'
      }
    ]
  },
  fields: {
    add: {
      masthead: {
        type: 'area',
        options: getWidgetGroups({
          includeLayouts: true
        })
      },
      beforeContent: {
        type: 'area',
        label: 'Before Articles Section',
        options: getWidgetGroups({
          includeLayouts: true
        })
      },
      sidebarContent: {
        type: 'area',
        label: 'Sidebar Content',
        if: {
          indexLayout: 'listAside'
        },
        options: getWidgetGroups({
          includeLayouts: true
        })
      },
      afterContent: {
        type: 'area',
        label: 'After Articles Section',
        options: getWidgetGroups({
          includeLayouts: true
        })
      },
      indexLayout: {
        type: 'select',
        label: 'Index Page Layout',
        def: 'heroGrid',
        choices: [
          {
            label: 'Hero Grid',
            value: 'heroGrid',
            help: 'Featured article with grid layout below'
          },
          {
            label: 'List with Aside',
            value: 'listAside',
            help: 'Articles in a list with side navigation'
          },
          {
            label: 'Standard',
            value: 'standard',
            help: 'Traditional blog-style listing'
          }
        ]
      },
      showLayout: {
        type: 'select',
        label: 'Article Display Layout',
        def: 'fullWidth',
        choices: [
          {
            label: 'Full Width',
            value: 'fullWidth',
            help: 'Hero image and content spanning full width'
          },
          {
            label: 'Magazine Style',
            value: 'magazine',
            help: 'Enhanced typography with pull quotes and featured sections'
          },
          {
            label: 'Minimal',
            value: 'minimal',
            help: 'Simple, clean layout with focus on content'
          }
        ]
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: ['masthead', 'beforeContent', 'sidebarContent', 'afterContent']
      },
      utility: {
        label: 'Display Options',
        fields: ['indexLayout', 'showLayout']
      }
    }
  }
};
