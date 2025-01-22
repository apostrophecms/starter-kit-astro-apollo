import colorOptionsHelper from '../../../lib/helpers/color-options.js';
import textSizeHelper from '../../../lib/helpers/typography-options.js';

export default {
  fields: {
    add: {
      brandingGroup: {
        type: 'object',
        label: 'Brand Settings',
        fields: {
          add: {
            siteTitle: {
              type: 'string',
              label: 'Site Title',
              required: true,
              def: 'Apos & Astro'
            },
            brandingType: {
              type: 'select',
              label: 'Header Branding Type',
              required: true,
              def: 'text',
              choices: [
                {
                  label: 'Text Only',
                  value: 'text'
                },
                {
                  label: 'Logo Only',
                  value: 'logo'
                },
                {
                  label: 'Logo and Text',
                  value: 'both'
                }
              ]
            },
            siteLogo: {
              type: 'attachment',
              label: 'Site Logo',
              fileGroup: 'images',
              if: {
                $or: [
                  { brandingType: 'logo' },
                  { brandingType: 'both' }
                ]
              }
            },
            siteTextSize: {
              type: 'select',
              label: 'Site Title Size',
              choices: textSizeHelper.getTextSizes(),
              def: 'medium',
              if: {
                $or: [
                  { brandingType: 'logo' },
                  { brandingType: 'both' }
                ]
              }
            },
            logoMaxHeight: {
              type: 'range',
              label: 'Logo Max Height (px)',
              min: 20,
              max: 100,
              def: 40,
              if: {
                $or: [
                  { brandingType: 'logo' },
                  { brandingType: 'both' }
                ]
              }
            },
            mobileDisplayPreference: {
              type: 'select',
              label: 'Mobile Branding Preference',
              choices: [
                {
                  label: 'Same as Desktop',
                  value: 'same'
                },
                {
                  label: 'Text Only',
                  value: 'text'
                },
                {
                  label: 'Logo Only',
                  value: 'logo'
                }
              ],
              def: 'same'
            }
          }
        }
      },
      headerGroup: {
        type: 'object',
        label: 'Header Settings',
        fields: {
          add: {
            headerPosition: {
              type: 'select',
              label: 'Header Position',
              help: 'Choose how the header behaves when scrolling',
              choices: [
                { label: 'Floating - Always Visible', value: 'fixed' },
                { label: 'Floating - Fade on Scroll', value: 'fixed-fade' },
                { label: 'Static - Scrolls With Content', value: 'static' }
              ],
              def: 'fixed'
            },
            navAlignment: {
              type: 'select',
              label: 'Navigation Alignment',
              choices: [
                { label: 'Start', value: 'start' },
                { label: 'End', value: 'end' }
              ],
              def: 'end'
            },
            headerBackgroundColor: {
              type: 'select',
              label: 'Header Background Color',
              help: 'Choose the background color for the navigation bar',
              choices: colorOptionsHelper.getColorOptions(),
              def: 'transparent'
            },
            transparency: {
              type: 'range',
              label: 'Header Transparency',
              help: '0 is fully transparent, 100 is solid',
              min: 0,
              max: 100,
              step: 5,
              def: 100,
              if: {
                $or: [
                  { headerPosition: 'fixed' },
                  { headerPosition: 'static' }
                ]
              }
            },
            spacing: {
              type: 'select',
              label: 'Header Spacing',
              help: 'Control the spacing around header content',
              choices: [
                { label: 'None', value: '' },
                { label: 'Small', value: 'spacing-sm' },
                { label: 'Medium', value: 'spacing-md' },
                { label: 'Large', value: 'spacing-lg' }
              ],
              def: 'spacing-md'
            },
            headerTextColor: {
              type: 'select',
              label: 'Header Text Color',
              help: 'Choose the color for navigation text',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              ),
              def: 'black'
            },
            headerActiveColor: {
              type: 'select',
              label: 'Active Link Color',
              help: 'Color for the currently active navigation item',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            },
            headerHoverColor: {
              type: 'select',
              label: 'Link Hover Color',
              help: 'Color for the navigation item when hovered over',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            },
            dropdownTextColor: {
              type: 'select',
              label: 'Dropdown Text Color',
              help: 'Choose the color for dropdown text',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            },
            mobileMenuColor: {
              type: 'select',
              label: 'Mobile Menu Icon Color',
              help: 'Choose the color for the mobile menu icon',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            }
          }
        }
      },
      footerGroup: {
        type: 'object',
        label: 'Footer Settings',
        fields: {
          add: {
            showBranding: {
              type: 'boolean',
              label: 'Show Branding in Footer',
              help: 'Uses the same branding configuration as header',
              def: true
            },
            // Appearance settings
            footerBackgroundColor: {
              type: 'select',
              label: 'Background Color',
              help: 'Choose the background color for the footer',
              choices: colorOptionsHelper.getColorOptions(),
              def: 'white'
            },
            footerTextColor: {
              type: 'select',
              label: 'Text Color',
              help: 'Choose the color for footer text',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              ),
              def: 'black'
            },
            footerLinkColor: {
              type: 'select',
              label: 'Link Color',
              help: 'Choose the color for footer links',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            },
            footerLinkHoverColor: {
              type: 'select',
              label: 'Link Hover Color',
              help: 'Choose the color for footer links when hovered over',
              choices: colorOptionsHelper.getColorOptions().filter(color =>
                color.value !== 'transparent'
              )
            },
            // Social Media settings
            socialLinks: {
              type: 'array',
              label: 'Social Media Links',
              titleField: 'platform',
              fields: {
                add: {
                  platform: {
                    type: 'select',
                    label: 'Platform',
                    required: true,
                    choices: [
                      { label: 'Facebook', value: 'facebook' },
                      { label: 'Twitter/X', value: 'twitter' },
                      { label: 'Instagram', value: 'instagram' },
                      { label: 'LinkedIn', value: 'linkedin' },
                      { label: 'YouTube', value: 'youtube' },
                      { label: 'GitHub', value: 'github' },
                      { label: 'TikTok', value: 'tiktok' },
                      { label: 'Pinterest', value: 'pinterest' },
                      { label: 'Discord', value: 'discord' },
                      { label: 'Mastodon', value: 'mastodon' }
                    ]
                  },
                  url: {
                    type: 'url',
                    label: 'URL',
                    required: true
                  },
                  ariaLabel: {
                    type: 'string',
                    label: 'Accessibility Label',
                    help: 'Custom screen reader text (e.g., "Follow us on Facebook")',
                    def: ''
                  }
                }
              },
              max: 10
            },
            socialIconStyle: {
              type: 'select',
              label: 'Social Icon Style',
              choices: [
                { label: 'Rounded', value: 'rounded' },
                { label: 'Circle', value: 'circle' },
                { label: 'Square', value: 'square' },
                { label: 'Square Rounded', value: 'square-rounded' }
              ],
              def: 'rounded'
            },
            socialIconSize: {
              type: 'select',
              label: 'Social Icon Size',
              choices: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' }
              ],
              def: 'md'
            },
            socialPosition: {
              type: 'select',
              label: 'Social Icons Position',
              choices: [
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' }
              ],
              def: 'top'
            },
            // Custom Links
            footerSections: {
              type: 'array',
              label: 'Footer Sections',
              titleField: 'sectionTitle',
              fields: {
                add: {
                  sectionTitle: {
                    type: 'string',
                    label: 'Section Title',
                    required: true
                  },
                  links: {
                    type: 'array',
                    label: 'Links',
                    titleField: 'linkText',
                    fields: {
                      add: {
                        linkText: {
                          type: 'string',
                          label: 'Link Text',
                          required: true
                        },
                        linkUrl: {
                          type: 'url',
                          label: 'Link URL',
                          required: true
                        },
                        openInNewTab: {
                          type: 'boolean',
                          label: 'Open in New Tab',
                          def: false
                        }
                      }
                    }
                  }
                }
              }
            },
            // Copyright settings
            copyrightText: {
              type: 'string',
              label: 'Copyright Text',
              help: 'Optional custom copyright text. Year will be added automatically.',
              textarea: true
            },
            showYear: {
              type: 'boolean',
              label: 'Show Current Year',
              def: true
            },
            additionalFooterText: {
              type: 'array',
              label: 'Additional Footer Text',
              titleField: 'text',
              fields: {
                add: {
                  text: {
                    type: 'string',
                    label: 'Text',
                    textarea: true
                  }
                }
              }
            }
          }
        }
      }
    },
    group: {
      branding: {
        label: 'Branding',
        fields: ['brandingGroup']
      },
      header: {
        label: 'Header',
        fields: ['headerGroup']
      },
      footer: {
        label: 'Footer',
        fields: ['footerGroup']
      }
    }
  }
};
