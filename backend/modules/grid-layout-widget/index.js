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
  init(self) {
    self.apos.migration.add('fix-areas', self.migrateAreaNames);
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

    const standardLayoutsCondition = {
      $or: [
        { layoutType: 'asideMain' },
        { layoutType: 'mainAside' },
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
    };

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
              value: 'asideMain'
            },
            {
              label: 'Main Content + Aside',
              value: 'mainAside'
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
          if: standardLayoutsCondition,
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
              horizontalAlign: {
                type: 'select',
                label: 'Horizontal Alignment',
                choices: [
                  { label: 'Left', value: 'start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Right', value: 'end' },
                  { label: 'Stretch', value: 'stretch' }
                ],
                def: 'stretch'
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
              spacing: {
                type: 'object',
                label: 'Responsive Spacing',
                fields: {
                  add: {
                    tabletGap: {
                      type: 'string',
                      label: 'Grid Gap (Tablet) e.g., "10px" or "1rem"',
                      def: '0.75rem'
                    },
                    mobileGap: {
                      type: 'string',
                      label: 'Grid Gap (Mobile) e.g., "10px" or "1rem"',
                      def: '0.5rem'
                    }
                  }
                }
              }
            }
          }
        },
        mainContent: {
          type: 'area',
          label: 'Main Content Area',
          options: baseAreaConfig,
          if: standardLayoutsCondition
        },
        primaryAsideContent: {
          type: 'area',
          label: 'Primary Aside',
          options: baseAreaConfig,
          if: standardLayoutsCondition
        },
        secondaryAsideContent: {
          type: 'area',
          label: 'Secondary Aside or Main',
          options: baseAreaConfig,
          if: {
            $or: [
              { layoutType: 'twoMainAside' },
              { layoutType: 'asideTwoMain' },
              { layoutType: 'magazineLayout' },
              { layoutType: 'featuredThreeGrid' },
              { layoutType: 'galleryMasonry' },
              { layoutType: 'dashboardLayout' }
            ]
          }
        },
        // Layout-specific content areas
        headerContent: {
          type: 'area',
          label: 'Header Content',
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
        columnThreeContent: {
          type: 'area',
          label: 'Column Three',
          options: baseAreaConfig,
          if: {
            layoutType: 'featuredThreeGrid'
          }
        },
        headlineContent: {
          type: 'area',
          label: 'Headline Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        section1Content: {
          type: 'area',
          label: 'Footer Section 1',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        section2Content: {
          type: 'area',
          label: 'Footer Section 2',
          options: baseAreaConfig,
          if: {
            layoutType: 'contentHub'
          }
        },
        galleryBottomContent: {
          type: 'area',
          label: 'Bottom Footer Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'galleryMasonry'
          }
        },
        tertiaryAsideContent: {
          type: 'area',
          label: 'Tertiary Aside Content',
          options: baseAreaConfig,
          if: {
            layoutType: 'dashboardLayout'
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
  },
  methods(self) {
    return {
      async migrateAreaNames() {
        // Track updates for logging
        let widgetsUpdated = 0;

        await self.apos.migration.eachWidget(
          {},
          async (doc, widget, dotPath) => {
            if (widget.type !== 'grid-layout') {
              return;
            };
            const updates = {};
            let hasUpdates = false;

            // Handle layout type changes
            if (widget.layoutType === 'asideMainThree') {
              updates[`${dotPath}.layoutType`] = 'asideMain';
              hasUpdates = true;

              // Map specific areas to standardized areas
              if (widget.asideContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.asideContent;
                updates[`${dotPath}.asideContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'mainAsideThree') {
              updates[`${dotPath}.layoutType`] = 'mainAside';
              hasUpdates = true;

              // Map specific areas to standardized areas
              if (widget.asideContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.asideContent;
                updates[`${dotPath}.asideContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'headerTwoColFooter') {
              // Layout name stays the same but areas changed
              if (widget.leftColumnContent) {
                updates[`${dotPath}.mainContent`] = widget.leftColumnContent;
                updates[`${dotPath}.leftColumnContent`] = null;
                hasUpdates = true;
              }

              if (widget.rightColumnContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.rightColumnContent;
                updates[`${dotPath}.rightColumnContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'featuredThreeGrid') {
              // Update area names
              if (widget.featuredContent) {
                updates[`${dotPath}.mainContent`] = widget.featuredContent;
                updates[`${dotPath}.featuredContent`] = null;
                hasUpdates = true;
              }

              if (widget.columnOneContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.columnOneContent;
                updates[`${dotPath}.columnOneContent`] = null;
                hasUpdates = true;
              }

              if (widget.columnTwoContent) {
                updates[`${dotPath}.secondaryAsideContent`] = widget.columnTwoContent;
                updates[`${dotPath}.columnTwoContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'twoMainAside' || widget.layoutType === 'asideTwoMain') {
              // Map specific areas to standardized areas
              if (widget.asideLongContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.asideLongContent;
                updates[`${dotPath}.asideLongContent`] = null;
                hasUpdates = true;
              }

              if (widget.mainTopContent) {
                updates[`${dotPath}.mainContent`] = widget.mainTopContent;
                updates[`${dotPath}.mainTopContent`] = null;
                hasUpdates = true;
              }

              if (widget.mainBottomContent) {
                updates[`${dotPath}.secondaryAsideContent`] = widget.mainBottomContent;
                updates[`${dotPath}.mainBottomContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'magazineLayout') {
              // Map specific areas to standardized areas
              if (widget.headlineContent) {
                updates[`${dotPath}.mainContent`] = widget.headlineContent;
                updates[`${dotPath}.headlineContent`] = null;
                hasUpdates = true;
              }

              if (widget.sidebarContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.sidebarContent;
                updates[`${dotPath}.sidebarContent`] = null;
                hasUpdates = true;
              }

              if (widget.feature1Content) {
                updates[`${dotPath}.secondaryAsideContent`] = widget.feature1Content;
                updates[`${dotPath}.feature1Content`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'contentHub') {
              // Map specific areas to standardized areas
              if (widget.heroContent) {
                updates[`${dotPath}.mainContent`] = widget.heroContent;
                updates[`${dotPath}.heroContent`] = null;
                hasUpdates = true;
              }

              if (widget.featuredHubContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.featuredHubContent;
                updates[`${dotPath}.featuredHubContent`] = null;
                hasUpdates = true;
              }

              if (widget.quickLinksContent) {
                updates[`${dotPath}.headlineContent`] = widget.quickLinksContent;
                updates[`${dotPath}.quickLinksContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'galleryMasonry') {
              // Map specific areas to standardized areas
              if (widget.galleryFeaturedContent) {
                updates[`${dotPath}.mainContent`] = widget.galleryFeaturedContent;
                updates[`${dotPath}.galleryFeaturedContent`] = null;
                hasUpdates = true;
              }

              if (widget.gallerySide1Content) {
                updates[`${dotPath}.primaryAsideContent`] = widget.gallerySide1Content;
                updates[`${dotPath}.gallerySide1Content`] = null;
                hasUpdates = true;
              }

              if (widget.gallerySide2Content) {
                updates[`${dotPath}.secondaryAsideContent`] = widget.gallerySide2Content;
                updates[`${dotPath}.gallerySide2Content`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'dashboardLayout') {
              // Map specific areas to standardized areas
              if (widget.mainMetricContent) {
                updates[`${dotPath}.mainContent`] = widget.mainMetricContent;
                updates[`${dotPath}.mainMetricContent`] = null;
                hasUpdates = true;
              }

              if (widget.sideMetricsContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.sideMetricsContent;
                updates[`${dotPath}.sideMetricsContent`] = null;
                hasUpdates = true;
              }

              if (widget.chartContent) {
                updates[`${dotPath}.secondaryAsideContent`] = widget.chartContent;
                updates[`${dotPath}.chartContent`] = null;
                hasUpdates = true;
              }

              if (widget.tableContent) {
                updates[`${dotPath}.tertiaryAsideContent`] = widget.tableContent;
                updates[`${dotPath}.tableContent`] = null;
                hasUpdates = true;
              }
            }
            else if (widget.layoutType === 'productShowcase') {
              // Map specific areas to standardized areas
              if (widget.mainProductContent) {
                updates[`${dotPath}.mainContent`] = widget.mainProductContent;
                updates[`${dotPath}.mainProductContent`] = null;
                hasUpdates = true;
              }

              if (widget.productDetailsContent) {
                updates[`${dotPath}.primaryAsideContent`] = widget.productDetailsContent;
                updates[`${dotPath}.productDetailsContent`] = null;
                hasUpdates = true;
              }
            }

            // Only update the document if we have changes to make
            if (hasUpdates) {
              widgetsUpdated++;

              // Create a $unset object for fields we want to completely remove
              const unsetObj = {};

              for (const key in updates) {
                if (updates[key] === null) {
                  // Add to unset and remove from updates
                  unsetObj[key] = '';
                  delete updates[key];
                }
              }

              const updateObj = {};
              if (Object.keys(updates).length > 0) {
                updateObj.$set = updates;
              }

              if (Object.keys(unsetObj).length > 0) {
                updateObj.$unset = unsetObj;
              }

              // Only perform update if we have operations to do
              if (Object.keys(updateObj).length > 0) {
                return self.apos.doc.db.updateOne(
                  { _id: doc._id },
                  updateObj
                );
              }
            }
          }
        );

        console.log(`Grid layout migration complete. Updated ${widgetsUpdated} widgets.`);
      }
    };
  }
};
