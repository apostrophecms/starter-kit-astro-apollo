import colorOptionsHelper from '../helpers/color-options.js';
import textOptionsHelper from '../helpers/typography-options.js';

export const cardFields = {
  cardType: {
    type: 'select',
    label: 'Card Type',
    choices: [
      {
        label: 'Basic Card',
        value: 'basic'
      },
      {
        label: 'Image Card',
        value: 'image'
      },
      {
        label: 'Image Overlay',
        value: 'image-overlay'
      },
      {
        label: 'Media Card',
        value: 'media',
        help: 'Features a main image with author/profile section below'
      }
    ],
    required: true,
    def: 'basic'
  },
  minHeight: {
    type: 'select',
    label: 'Card Height',
    choices: [
      { label: 'Auto', value: '' },
      { label: 'Small', value: 'is-small' },
      { label: 'Medium', value: 'is-medium' },
      { label: 'Large', value: 'is-large' }
    ],
    def: ''
  },
  _mainImage: {
    type: 'relationship',
    label: 'Main Image',
    withType: '@apostrophecms/image',
    max: 1,
    if: {
      $or: [
        { cardType: 'image' },
        { cardType: 'image-overlay' },
        { cardType: 'media' }
      ]
    }
  },
  useImageRatio: {
    type: 'boolean',
    label: 'Force Image Ratio?',
    def: false,
    if: {
      $or: [
        { cardType: 'image' },
        { cardType: 'image-overlay' },
        { cardType: 'media' }
      ]
    }
  },
  imageRatio: {
    type: 'select',
    label: 'Image Ratio',
    choices: [
      { label: 'Square (1:1)', value: 'is-1by1' },
      { label: '4:3', value: 'is-4by3' },
      { label: '3:2', value: 'is-3by2' },
      { label: '16:9', value: 'is-16by9' }
    ],
    if: {
      useImageRatio: true,
      $or: [
        { cardType: 'image' },
        { cardType: 'image-overlay' },
        { cardType: 'media' }
      ]
    }
  },
  _avatar: {
    type: 'relationship',
    label: 'Profile Image',
    withType: '@apostrophecms/image',
    max: 1,
    if: {
      cardType: 'media'
    }
  },
  cardTitle: {
    type: 'string',
    label: 'Card Title',
    required: true
  },
  subtitle: {
    type: 'string',
    label: 'Subtitle'
  },
  titleSize: {
    type: 'select',
    label: 'Title Size',
    choices: [
      { label: 'Normal', value: 'is-4' },
      { label: 'Large', value: 'is-3' },
      { label: 'Small', value: 'is-5' }
    ],
    def: 'is-4'
  },
  titleColor: {
    type: 'select',
    label: 'Title Color',
    choices: colorOptionsHelper.getColorOptions().filter(color =>
      color.value !== 'transparent'
    )
  },
  content: {
    type: 'area',
    label: 'Card Content',
    options: {
      widgets: {
        '@apostrophecms/rich-text': {},
        link: {}
      }
    }
  },
  contentColor: {
    type: 'select',
    label: 'Content Text Color',
    choices: colorOptionsHelper.getColorOptions().filter(color =>
      color.value !== 'transparent'
    ),
    def: 'black'
  },
  headerAlignment: {
    type: 'select',
    label: 'Title & Subtitle Alignment',
    choices: [
      { label: 'Left', value: 'has-text-left' },
      { label: 'Center', value: 'has-text-centered' },
      { label: 'Right', value: 'has-text-right' }
    ],
    def: 'has-text-left'
  },
  contentAlignment: {
    type: 'select',
    label: 'Content Alignment',
    choices: [
      { label: 'Left', value: 'has-text-left' },
      { label: 'Center', value: 'has-text-centered' },
      { label: 'Right', value: 'has-text-right' }
    ],
    def: 'has-text-left'
  },
  backgroundColor: {
    type: 'select',
    label: 'Background Color',
    choices: colorOptionsHelper.getColorOptions()
  },
  showOverlay: {
    type: 'boolean',
    label: 'Show Overlay on Image',
    def: false,
    if: {
      cardType: 'image' // Only show this field when cardType is 'image'
    }
  },
  overlayColor: {
    type: 'select',
    label: 'Overlay Color',
    choices: colorOptionsHelper.getColorOptions(),
    if: {
      $or: [
        { cardType: 'image-overlay' },
        { showOverlay: true }
      ]
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
      $or: [
        { cardType: 'image-overlay' },
        { showOverlay: true }
      ]
    }
  },
  hasFooter: {
    type: 'boolean',
    label: 'Add Footer?',
    def: false
  },
  footerContent: {
    type: 'area',
    label: 'Footer Content',
    if: {
      hasFooter: true
    },
    options: {
      widgets: {
        '@apostrophecms/rich-text': {},
        link: {}
      }
    }
  },
  addFooterBorder: {
    type: 'boolean',
    label: 'Footer Border',
    def: false,
    if: {
      hasFooter: true
    }
  },
  footerBorderWidth: {
    type: 'select',
    label: 'Border Width',
    choices: [
      { label: 'Thin', value: 'thin' },
      { label: 'Medium', value: 'medium' },
      { label: 'Thick', value: 'thick' }
    ],
    def: 'thin',
    if: {
      addFooterBorder: true // Only show if addBorder is enabled
    }
  },
  footerBorderColor: {
    type: 'select',
    label: 'Border Color',
    choices: colorOptionsHelper.getColorOptions(),
    if: {
      addFooterBorder: true // Only show if addBorder is enabled
    }
  }
};

export const cardGroups = {
  basics: {
    label: 'Basic Settings',
    fields: ['cardType']
  },
  images: {
    label: 'Images',
    fields: ['_mainImage', 'useImageRatio', 'imageRatio', '_avatar']
  },
  content: {
    label: 'Content',
    fields: ['cardTitle', 'subtitle', 'headerAlignment', 'titleSize', 'content', 'contentAlignment']
  },
  styling: {
    label: 'Styling',
    fields: [
      'minHeight',
      'titleColor',
      'contentColor',
      'backgroundColor',
      'showOverlay',
      'overlayColor',
      'overlayOpacity'
    ]
  },
  footer: {
    label: 'Footer',
    fields: ['hasFooter', 'footerContent', 'addFooterBorder', 'footerBorderWidth', 'footerBorderColor']
  }
};
