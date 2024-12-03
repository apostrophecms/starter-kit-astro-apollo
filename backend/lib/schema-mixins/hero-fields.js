import colorOptionsHelper from '../../lib/helpers/color-options.js';

export default {
  layout: {
    type: 'select',
    label: 'Layout Style',
    def: 'full',
    choices: [
      {
        label: 'Full Width',
        value: 'full'
      },
      {
        label: 'Split Content',
        value: 'split'
      }
    ]
  },
  splitSide: {
    type: 'select',
    label: 'Content Position (Split Layout)',
    def: 'left',
    choices: [
      {
        label: 'Left Side',
        value: 'left'
      },
      {
        label: 'Right Side',
        value: 'right'
      }
    ],
    if: {
      layout: 'split'
    }
  },
  background: {
    type: 'select',
    label: 'Background Type',
    def: 'image',
    choices: [
      {
        label: 'Color',
        value: 'color'
      },
      {
        label: 'Image',
        value: 'image'
      },
      {
        label: 'Video',
        value: 'video'
      }
    ]
  },
  backgroundColorType: {
    type: 'select',
    label: 'Background Color Type',
    choices: [
      {
        label: 'Solid',
        value: 'solid'
      },
      {
        label: 'Gradient',
        value: 'gradient'
      }
    ],
    if: {
      background: 'color'
    }
  },
  mainColor: {
    type: 'select',
    label: 'Main Background Color',
    choices: colorOptionsHelper.getColorOptions().filter(color =>
      color.value !== 'transparent'
    ),
    if: {
      background: 'color'
    }
  },
  secondaryColor: {
    type: 'select',
    label: 'Secondary Background Color',
    choices: colorOptionsHelper.getColorOptions().filter(color =>
      color.value !== 'transparent'
    ),
    if: {
      backgroundColorType: 'gradient',
      background: 'color'
    }
  },
  gradientAngle: {
    type: 'select',
    label: 'Gradient Angle',
    choices: [
      { label: 'To Right', value: '90deg' },
      { label: 'To Bottom Right', value: '135deg' },
      { label: 'To Bottom', value: '180deg' },
      { label: 'To Bottom Left', value: '225deg' },
      { label: 'To Left', value: '270deg' }
    ],
    if: {
      backgroundColorType: 'gradient',
      background: 'color'
    }
  },
  _backgroundImage: {
    type: 'relationship',
    label: 'Background Image',
    withType: '@apostrophecms/image',
    max: 1,
    required: true,
    if: {
      background: 'image'
    }
  },
  imagePosition: {
    type: 'select',
    label: 'Image Position',
    choices: [
      {
        label: 'Top',
        value: 'top'
      },
      {
        label: 'Center',
        value: 'center'
      },
      {
        label: 'Bottom',
        value: 'bottom'
      }
    ],
    def: 'center',
    if: {
      background: 'image'
    }
  },
  videoBackground: {
    type: 'attachment',
    label: 'Background Video',
    help: 'Upload an MP4 (recommended) or WebM file. For best performance, keep file size under 10MB. Animated GIFs are also supported but not recommended due to file size. Recommended dimensions: 1920x1080.',
    fileGroup: 'videos',
    max: 1,
    if: {
      background: 'video'
    }
  },
  videoBackgroundMobile: {
    type: 'attachment',
    label: 'Mobile Background Video (Optional)',
    help: 'If provided, this image will be used on mobile devices instead of the main background video',
    fileGroup: 'images',
    max: 1,
    if: {
      background: 'video'
    }
  },
  enableOverlay: {
    type: 'boolean',
    label: 'Enable Overlay',
    help: 'Add a semi-transparent overlay to the background image or video',
    def: true,
    if: {
      $or: [
        { background: 'image' },
        { background: 'video' }
      ]
    }
  },
  overlayColor: {
    type: 'select',
    label: 'Overlay Color',
    choices: colorOptionsHelper.getColorOptions().filter(color =>
      color.value !== 'transparent'
    ),
    if: {
      enableOverlay: true
    }
  },
  overlayOpacity: {
    type: 'select',
    label: 'Overlay Opacity',
    choices: [
      { label: 'Very light', value: '20%' },
      { label: 'Light', value: '30%' },
      { label: 'Medium', value: '40%' },
      { label: 'Dark', value: '50%' },
      { label: 'Very dark', value: '60%' }
    ],
    if: {
      enableOverlay: true
    }
  },
  height: {
    type: 'select',
    label: 'Hero Height',
    def: 'medium',
    choices: [
      {
        label: 'Small (400px)',
        value: 'small'
      },
      {
        label: 'Medium (600px)',
        value: 'medium'
      },
      {
        label: 'Large (800px)',
        value: 'large'
      },
      {
        label: 'Full Viewport',
        value: 'fullheight'
      }
    ]
  },
  contentAlignment: {
    type: 'select',
    label: 'Content Alignment',
    def: 'center',
    choices: [
      {
        label: 'Left',
        value: 'left'
      },
      {
        label: 'Center',
        value: 'center'
      },
      {
        label: 'Right',
        value: 'right'
      }
    ]
  },
  mainContent: {
    type: 'object',
    label: 'Main Content',
    fields: {
      add: {
        pretitle: {
          type: 'string',
          label: 'Pre-title Text',
          help: 'Optional text above the main title'
        },
        pretitleColor: {
          type: 'select',
          label: 'Pretitle Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          )
        },
        title: {
          type: 'string',
          label: 'Main Title',
          required: true
        },
        titleColor: {
          type: 'select',
          label: 'Title Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          )
        },
        subtitle: {
          type: 'string',
          label: 'Subtitle',
          textarea: true
        },
        subtitleColor: {
          type: 'select',
          label: 'Subtitle Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          )
        }
      }
    }
  },
  callToAction: {
    type: 'area',
    label: 'Call-to-Action Links',
    options: {
      widgets: {
        link: {}
      },
      max: 2
    }
  }
};
