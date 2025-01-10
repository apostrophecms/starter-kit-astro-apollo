import colorOptionsHelper from '../helpers/color-options.js';

export default {
  linkText: {
    label: 'Link/Button Text',
    type: 'string',
    def: 'Click Here',
    required: true
  },
  linkType: {
    label: 'Link Type',
    type: 'select',
    required: true,
    choices: [
      {
        label: 'Page',
        value: 'page'
      },
      {
        label: 'File',
        value: 'file'
      },
      {
        label: 'Custom URL',
        value: 'custom'
      }
    ]
  },
  _linkPage: {
    label: 'Page to Link',
    type: 'relationship',
    withType: '@apostrophecms/page',
    max: 1,
    builders: {
      project: {
        title: 1,
        _url: 1
      }
    },
    if: {
      linkType: 'page'
    },
    required: true
  },
  _linkFile: {
    label: 'File to Link',
    type: 'relationship',
    withType: '@apostrophecms/file',
    max: 1,
    if: {
      linkType: 'file'
    },
    required: true
  },
  linkUrl: {
    label: 'URL for Custom Link',
    type: 'url',
    if: {
      linkType: 'custom'
    },
    required: true
  },
  linkTarget: {
    label: 'Open link in new tab?',
    type: 'checkboxes',
    choices: [
      {
        label: 'Open in new tab',
        value: '_blank'
      }
    ]
  },
  linkStyle: {
    label: 'Link Style',
    type: 'select',
    def: 'button',
    choices: [
      {
        label: 'Button',
        value: 'button'
      },
      {
        label: 'Text Link',
        value: 'text-link'
      }
    ]
  },
  buttonStyle: {
    type: 'select',
    label: 'Button Style',
    def: '',
    choices: [
      { label: 'Solid', value: '' },
      { label: 'Outlined', value: 'outlined' },
      { label: 'Inverted', value: 'inverted' },
      { label: 'Rounded', value: 'rounded' }
    ],
    if: {
      linkStyle: 'button'
    }
  },
  buttonSize: {
    label: 'Button Size',
    type: 'select',
    def: 'large',
    choices: [
      {
        label: 'Small',
        value: 'small'
      },
      {
        label: 'Default',
        value: ''
      },
      {
        label: 'Normal',
        value: 'normal'
      },
      {
        label: 'Medium',
        value: 'medium'
      },
      {
        label: 'Large',
        value: 'large'
      }
    ],
    if: {
      linkStyle: 'button'
    }
  },
  buttonDisabled: {
    label: 'Disabled Button?',
    type: 'boolean',
    if: {
      linkStyle: 'button'
    },
    def: false
  },
  addIcon: {
    label: 'Add Icon?',
    type: 'boolean',
    if: {
      linkStyle: 'button'
    },
    def: false
  },
  icon: {
    label: 'Icon Name',
    type: 'string',
    htmlHelp: 'Enter the name of the icon you want to use. For example, <a href="https://fontawesome.com/search?q=arrow&o=r" target="_blank">"arrow-right"</a>.',
    if: {
      linkStyle: 'button',
      addIcon: true
    }
  },
  iconPosition: {
    label: 'Icon Position',
    type: 'select',
    def: 'left',
    choices: [
      {
        label: 'Left',
        value: 'left'
      },
      {
        label: 'Right',
        value: 'right'
      }
    ],
    if: {
      linkStyle: 'button',
      addIcon: true
    }
  },
  buttonAlignment: {
    type: 'select',
    label: 'Button Alignment',
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
    ],
    def: 'left',
    if: {
      linkStyle: 'button'
    }
  },
  buttonColor: {
    label: 'Button Color',
    type: 'select',
    def: 'primary',
    choices: colorOptionsHelper.getColorOptions(),
    if: {
      linkStyle: 'button'
    }
  }
};
