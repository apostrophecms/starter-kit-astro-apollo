import colorOptionsHelper from '../../lib/helpers/color-options.js';

export default {
  slideDuration: {
    type: 'integer',
    label: 'Slide Duration (ms)',
    def: 5000,
    min: 1000,
    max: 20000
  },
  transitionSpeed: {
    type: 'integer',
    label: 'Transition Speed (ms)',
    def: 1000,
    min: 100,
    max: 2000
  },
  autoplay: {
    type: 'boolean',
    label: 'Enable Autoplay',
    def: true
  },
  showControls: {
    type: 'boolean',
    label: 'Show Navigation Controls',
    def: true
  },
  slides: {
    type: 'array',
    label: 'Slides',
    titleField: 'slideTitle',
    inline: true,
    fields: {
      add: {
        slideTitle: {
          type: 'string',
          label: 'Slide Title',
          required: true
        },
        titleColor: {
          type: 'select',
          label: 'Title Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          )
        },
        titleSize: {
          type: 'select',
          label: 'Title Size',
          choices: [
            {
              label: 'Small',
              value: 'is-5'
            },
            {
              label: 'Medium',
              value: 'is-4'
            },
            {
              label: 'Large',
              value: 'is-3'
            }
          ],
          def: 'is-4'
        },
        cardContent: {
          type: 'string',
          label: 'Slide Content',
          textarea: true
        },
        contentColor: {
          type: 'select',
          label: 'Content Text Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          )
        },
        contentSize: {
          type: 'select',
          label: 'Content Text Size',
          choices: [
            {
              label: 'Small',
              value: 'is-size-6'
            },
            {
              label: 'Medium',
              value: 'is-size-5'
            },
            {
              label: 'Large',
              value: 'is-size-4'
            }
          ],
          def: 'is-size-6'
        },
        textBlockBackground: {
          type: 'select',
          label: 'Text Block Background Color',
          choices: colorOptionsHelper.getColorOptions().filter(color =>
            color.value !== 'transparent'
          ),
          def: 'white'
        },
        textBlockOpacity: {
          type: 'range',
          label: 'Text Block Opacity',
          min: 0,
          max: 100,
          step: 5,
          def: 70
        },
        _image: {
          type: 'relationship',
          label: 'Slide Image',
          withType: '@apostrophecms/image',
          max: 1
        }
      }
    }
  }
};
