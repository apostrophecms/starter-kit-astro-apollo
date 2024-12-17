import { getWidgetGroups } from '../../lib/helpers/area-widgets.js';

export default {
  extend: '@apostrophecms/piece-type',
  options: {
    label: 'Article',
    pluralLabel: 'Articles',
    shortcut: 'Shift+Alt+A'
  },
  fields: {
    add: {
      category: {
        type: 'select',
        label: 'Category',
        help: 'Choose a category for this article',
        choices: [
          {
            label: 'News',
            value: 'news'
          },
          {
            label: 'Opinion',
            value: 'opinion'
          },
          {
            label: 'Feature',
            value: 'feature'
          },
          {
            label: 'Review',
            value: 'review'
          }
        ]
      },
      _heroImage: {
        type: 'relationship',
        label: 'Hero Image',
        withType: '@apostrophecms/image',
        max: 1
      },
      excerpt: {
        type: 'string',
        textarea: true,
        label: 'Article Excerpt',
        help: 'Brief summary for listings and previews'
      },
      mainContent: {
        type: 'area',
        options: getWidgetGroups({
          includeLayouts: true
        })

      },
      _author: {
        type: 'relationship',
        label: 'Author',
        withType: 'author',
        withRelationships: [ '_articles' ]
      },
      publishDate: {
        lable: 'Publication Date',
        type: 'date',
        required: true
      },
      _related: {
        type: 'relationship',
        label: 'Related Articles',
        withType: 'article',
        max: 4,
        builders: {
          project: {
            title: 1,
            _url: 1
          }
        },
        withRelationships: [ '_heroImage' ]
      }
    },
    group: {
      basics: {
        label: 'Basic Info',
        fields: ['_author', 'category', 'publishDate', '_related']
      },
      content: {
        label: 'Content',
        fields: ['_heroImage', 'excerpt', 'mainContent']
      }
    }
  }
};
