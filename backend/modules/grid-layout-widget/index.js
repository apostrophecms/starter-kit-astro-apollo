import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import { getWidgetGroups } from '../../lib/helpers/area-widgets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Grid Layout Widget',
    width: 'one-half',
    icon: 'view-grid',
    description: 'Create responsive CSS Grid-based layouts for your content.',
    previewImage: 'svg'
  },
  icons: {
    'view-grid': 'ViewGrid'
  },
  // We need to pass fields as a function to allow for the preview HTML
  fields(self, options) {
    // Get base widget configuration for all areas
    const baseAreaConfig = getWidgetGroups({
      includeLayouts: true
    });

    // Read the preview HTML
    const previewHtml = readFileSync(
      join(__dirname, 'layoutPreviews.html'),
      'utf8'
    );
    return {
      add: {
        layoutType: {
          type: 'select',
          label: 'Layout Type',
          htmlHelp: previewHtml,
          required: true,
          choices: [
            {
              label: 'Aside + Main Content',
              value: 'asideMainThree'
            },
            {
              label: 'Main Content + Aside',
              value: 'mainAsideThree'
            },
            {
              label: 'Aside + Two Main Sections',
              value: 'asideTwoMain'
            },
            {
              label: 'Two Main Sections + Aside',
              value: 'twoMainAside'
            },
            {
              label: 'Header + 2 Columns + Footer',
              value: 'headerTwoColFooter'
            },
            {
              label: 'Featured + 3 Column Grid',
              value: 'featuredThreeGrid'
            },
            {
              label: 'Magazine Layout',
              value: 'magazineLayout'
            },
            {
              label: 'Content Hub',
              value: 'contentHub'
            },
            {
              label: 'Gallery Masonry',
              value: 'galleryMasonry'
            },
            {
              label: 'Dashboard Layout',
              value: 'dashboardLayout'
            },
            {
              label: 'Product Showcase',
              value: 'productShowcase'
            },
            {
              label: 'Custom Grid',
              value: 'custom'
            }
          ]
        },
        maxWidth: {
          type: 'select',
          label: 'Maximum Content Width',
          choices: [
            { label: 'Full Width', value: '' },
            { label: 'Extra Narrow (768px)', value: 'max-width-768' },
            { label: 'Narrow (960px)', value: 'max-width-960' },
            { label: 'Medium (1152px)', value: 'max-width-1152' },
            { label: 'Wide (1344px)', value: 'max-width-1344' }
          ],
          def: ''
        },
        areaStyles: {
          type: 'object',
          label: 'Area Styling',
          if: {
            $or: [
              { layoutType: 'asideMainThree' },
              { layoutType: 'mainAsideThree' },
              { layoutType: 'asideTwoMain' },
              { layoutType: 'twoMainAside' },
              { layoutType: 'headerTwoColFooter' },
              { layoutType: 'featuredThreeGrid' },
              { layoutType: 'magazineLayout' },
              { layoutType: 'contentHub' },
              { layoutType: 'galleryMasonry' },
              { layoutType: 'dashboardLayout' },
              { layoutType: 'productShowcase' }
            ]
          },
          fields: {
            add: {
              minHeight: {
                type: 'string',
                label: 'Minimum Height',
                help: 'E.g., 200px, 50vh'
              },
              verticalAlign: {
                type: 'select',
                label: 'Vertical Alignment',
                choices: [
                  { label: 'Top', value: 'start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Bottom', value: 'end' },
                  { label: 'Stretch', value: 'stretch' }
                ],
                def: 'start'
              },
              gapOverride: {
                type: 'string',
                label: 'Custom Gap',
                help: 'Override default gap spacing'
              }
            }
          }
        },
        responsiveSettings: {
          type: 'object',
          label: 'Responsive Settings',
          fields: {
            add: {
              tabletBreakpoint: {
                type: 'select',
                label: 'Tablet Layout Starts At',
                choices: [
                  { label: '1024px', value: '1024' },
                  { label: '960px', value: '960' },
                  { label: '868px', value: '868' }
                ],
                def: '1024'
              },
              mobileBreakpoint: {
                type: 'select',
                label: 'Mobile Layout Starts At',
                choices: [
                  { label: '768px', value: '768' },
                  { label: '640px', value: '640' },
                  { label: '480px', value: '480' }
                ],
                def: '768'
              },
              tabletLayout: {
                type: 'select',
                label: 'Tablet Layout Behavior',
                choices: [
                  { label: 'Maintain Grid (Reduced Columns)', value: 'grid' },
                  { label: 'Stack All Items', value: 'stack' }
                ],
                def: 'grid'
              },
              spacing: {
                type: 'object',
                label: 'Responsive Spacing',
                fields: {
                  add: {
                    tabletGap: {
                      type: 'string',
                      label: 'Grid Gap (Tablet)',
                      def: '0.75rem'
                    },
                    mobileGap: {
                      type: 'string',
                      label: 'Grid Gap (Mobile)',
                      def: '0.5rem'
                    }
                  }
                }
              }
            }
          }
        },
        asideContent: {
          type: 'area',
          label: 'Aside Content',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'asideMainThree' },
              { layoutType: 'mainAsideThree' }
            ]
          }
        },
        mainContent: {
          type: 'area',
          label: 'Main Content',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'asideMainThree' },
              { layoutType: 'mainAsideThree' }
            ]
          }
        },
        headerContent: {
          type: 'area',
          label: 'Header Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'headerTwoColFooter'
          }
        },
        leftColumnContent: {
          type: 'area',
          label: 'Left Column',
          options: baseAreaConfig,
          if: {
            layoutType: 'headerTwoColFooter'
          }
        },
        rightColumnContent: {
          type: 'area',
          label: 'Right Column',
          options: baseAreaConfig,
          if: {
            layoutType: 'headerTwoColFooter'
          }
        },
        footerContent: {
          type: 'area',
          label: 'Footer Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'headerTwoColFooter'
          }
        },
        featuredContent: {
          type: 'area',
          label: 'Featured Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'featuredThreeGrid'
          }
        },
        columnOneContent: {
          type: 'area',
          label: 'Column One',
          options: baseAreaConfig,
          if: {
            layoutType: 'featuredThreeGrid'
          }
        },
        columnTwoContent: {
          type: 'area',
          label: 'Column Two',
          options: baseAreaConfig,
          if: {
            layoutType: 'featuredThreeGrid'
          }
        },
        columnThreeContent: {
          type: 'area',
          label: 'Column Three',
          options: baseAreaConfig,
          if: {
            layoutType: 'featuredThreeGrid'
          }
        },
        asideLongContent: {
          type: 'area',
          label: 'Aside Content (Full Height)',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'twoMainAside' },
              { layoutType: 'asideTwoMain' }
            ]
          }
        },
        mainTopContent: {
          type: 'area',
          label: 'Main Content - Top Section',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'twoMainAside' },
              { layoutType: 'asideTwoMain' }
            ]
          }
        },
        mainBottomContent: {
          type: 'area',
          label: 'Main Content - Bottom Section',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'twoMainAside' },
              { layoutType: 'asideTwoMain' }
            ]
          }
        },
        headlineContent: {
          type: 'area',
          label: 'Headline Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'magazineLayout'
          }
        },
        sidebarContent: {
          type: 'area',
          label: 'Sidebar Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'magazineLayout'
          }
        },
        feature1Content: {
          type: 'area',
          label: 'Feature 1',
          options: baseAreaConfig,
          if: {
            layoutType: 'magazineLayout'
          }
        },
        feature2Content: {
          type: 'area',
          label: 'Feature 2',
          options: baseAreaConfig,
          if: {
            layoutType: 'magazineLayout'
          }
        },
        feature3Content: {
          type: 'area',
          label: 'Feature 3',
          options: baseAreaConfig,
          if: {
            layoutType: 'magazineLayout'
          }
        },
        heroContent: {
          type: 'area',
          label: 'Hero Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        featuredHubContent: {
          type: 'area',
          label: 'Featured Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        quickLinksContent: {
          type: 'area',
          label: 'Quick Links',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        section1Content: {
          type: 'area',
          label: 'Section 1',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        section2Content: {
          type: 'area',
          label: 'Section 2',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        fullWidthContent: {
          type: 'area',
          label: 'Full Width Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        galleryFeaturedContent: {
          type: 'area',
          label: 'Featured Gallery Item',
          options: baseAreaConfig,
          if: {
            layoutType: 'galleryMasonry'
          }
        },
        gallerySide1Content: {
          type: 'area',
          label: 'Side Gallery Item 1',
          options: baseAreaConfig,
          if: {
            layoutType: 'galleryMasonry'
          }
        },
        gallerySide2Content: {
          type: 'area',
          label: 'Side Gallery Item 2',
          options: baseAreaConfig,
          if: {
            layoutType: 'galleryMasonry'
          }
        },
        galleryBottomContent: {
          type: 'area',
          label: 'Bottom Gallery Item',
          options: baseAreaConfig,
          if: {
            layoutType: 'galleryMasonry'
          }
        },
        mainMetricContent: {
          type: 'area',
          label: 'Main Metric',
          options: baseAreaConfig,
          if: {
            layoutType: 'dashboardLayout'
          }
        },
        sideMetricsContent: {
          type: 'area',
          label: 'Side Metrics',
          options: baseAreaConfig,
          if: {
            layoutType: 'dashboardLayout'
          }
        },
        chartContent: {
          type: 'area',
          label: 'Chart',
          options: baseAreaConfig,
          if: {
            layoutType: 'dashboardLayout'
          }
        },
        tableContent: {
          type: 'area',
          label: 'Table',
          options: baseAreaConfig,
          if: {
            layoutType: 'dashboardLayout'
          }
        },
        mainProductContent: {
          type: 'area',
          label: 'Main Product',
          options: baseAreaConfig,
          if: {
            layoutType: 'productShowcase'
          }
        },
        productDetailsContent: {
          type: 'area',
          label: 'Product Details',
          options: baseAreaConfig,
          if: {
            layoutType: 'productShowcase'
          }
        },
        related1Content: {
          type: 'area',
          label: 'Related Product 1',
          options: baseAreaConfig,
          if: {
            layoutType: 'productShowcase'
          }
        },
        related2Content: {
          type: 'area',
          label: 'Related Product 2',
          options: baseAreaConfig,
          if: {
            layoutType: 'productShowcase'
          }
        },
        related3Content: {
          type: 'area',
          label: 'Related Product 3',
          options: baseAreaConfig,
          if: {
            layoutType: 'productShowcase'
          }
        },
        customGrid: {
          type: 'object',
          label: 'Custom Grid Settings',
          if: {
            layoutType: 'custom'
          },
          fields: {
            add: {
              rows: {
                type: 'integer',
                label: 'Number of Rows',
                def: 2
              },
              columns: {
                type: 'integer',
                label: 'Number of Columns',
                def: 2
              },
              gap: {
                type: 'string',
                label: 'Grid Gap',
                help: 'Set the spacing between grid items, e.g., "10px" or "1rem".',
                def: '10px'
              },
              padding: {
                type: 'string',
                label: 'Grid Padding',
                help: 'Set the padding for the grid container, e.g., "20px" or "2rem".',
                def: '0px'
              },
              margin: {
                type: 'string',
                label: 'Grid Margin',
                help: 'Set the margin for the grid container, e.g., "20px" or "2rem".',
                def: '0px'
              },
              contentAreas: {
                type: 'array',
                label: 'Content Areas',
                titleField: 'name',
                fields: {
                  add: {
                    name: {
                      type: 'string',
                      label: 'Grid Area Name'
                    },
                    rowStart: {
                      type: 'integer',
                      label: 'Row Start'
                    },
                    rowSpan: {
                      type: 'integer',
                      label: 'Row Span',
                      def: 1
                    },
                    colStart: {
                      type: 'integer',
                      label: 'Column Start'
                    },
                    colSpan: {
                      type: 'integer',
                      label: 'Column Span',
                      def: 1
                    },
                    tabletColSpan: {
                      type: 'integer',
                      label: 'Column Span (Tablet)',
                      help: 'Number of columns this area should span on tablet devices',
                      def: null
                    },
                    minHeight: {
                      type: 'string',
                      label: 'Minimum Height'
                    },
                    verticalAlign: {
                      type: 'select',
                      label: 'Vertical Alignment',
                      choices: [
                        { label: 'Top', value: 'start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Bottom', value: 'end' },
                        { label: 'Stretch', value: 'stretch' }
                      ],
                      def: 'start'
                    },
                    content: {
                      type: 'area',
                      label: 'Content',
                      options: baseAreaConfig
                    }
                  }
                }
              }
            }
          }
        },
        addOverride: {
          type: 'boolean',
          label: 'Add CSS target override?',
          help: 'Check this box to add an additional class for custom CSS targeting.',
        },
        overrideClass: {
          type: 'string',
          label: 'Override Class',
          help: 'Add a custom class for CSS targeting.',
          if: {
            addOverride: true
          }
        }
      }
    };
  }
};
