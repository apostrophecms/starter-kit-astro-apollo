import { cardFields, cardGroups } from '../../lib/schema-mixins/card-fields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Card',
    icon: 'sign-text-icon',
    previewImage: 'svg',
    description: 'Cards from simple to complex.'
  },
  fields: {
    add: cardFields,
    group: cardGroups
  }
};
