import { getWidgetGroups } from '../../../lib/helpers/area-widgets.js';
import heroFields from '../../../lib/schema-mixins/hero-fields.js';
import slideshowFields from '../../../lib/schema-mixins/slideshow-fields.js';

export default {
  options: {
    label: 'Home Page'
  },
  fields: {
    add: {
      layout: {
        type: 'select',
        label: 'Layout',
        choices: [
          {
            label: 'Foundation - with Hero',
            value: 'foundation',
            help: 'Traditional layout with hero section at the top'
          },
          {
            label: 'Showcase - with Slideshow',
            value: 'showcase',
            help: 'Features a prominent slideshow at the top'
          },
          {
            label: 'Minimal',
            value: 'minimal',
            help: 'Clean slate for custom designs'
          }
        ],
        def: 'foundation'
      },
      // Hero Section - For Foundation Layout
      heroSection: {
        type: 'object',
        label: 'Hero Section',
        fields: {
          add: heroFields
        },
        if: {
          layout: 'foundation'
        }
      },
      // Showcase Layout Sections
      showcaseSlideshow: {
        type: 'object',
        label: 'Showcase Slideshow',
        fields: {
          add: slideshowFields
        },
        if: {
          layout: 'showcase'
        }
      },
      // Main Content Area - Available for all layouts
      main: {
        type: 'area',
        label: 'Main Content',
        options: getWidgetGroups({
          includeLayouts: true
        })
      }
    },
    group: {
      utility: {
        label: 'Layout Settings',
        fields: [
          'layout'
        ]
      },
      hero: {
        label: 'Hero Section',
        fields: [
          'heroSection'
        ]
      },
      showcase: {
        label: 'Showcase Content',
        fields: [
          'showcaseSlideshow'
        ]
      },
      content: {
        label: 'Content',
        fields: [
          'main'
        ]
      }
    }
  }
};
