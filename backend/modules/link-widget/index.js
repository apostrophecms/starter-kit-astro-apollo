import linkFields from '../../lib/schema-mixins/link-fields.js';
export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Link',
    icon: 'link-icon',
    previewImage: 'svg',
    description: 'Add a button that links to a page or URL'
  },
  fields: {
    add: linkFields
  }
};
