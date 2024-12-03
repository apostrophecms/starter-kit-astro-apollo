import slideshowFields from '../../lib/schema-mixins/slideshow-fields.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'Slideshow',
    icon: 'view-carousel-outline',
    previewImage: 'svg',
    description: 'A slideshow of images with optional titles and content.'
  },
  icons: {
    'view-carousel-outline': 'ViewCarouselOutline'
  },
  fields: {
    add: slideshowFields
  }
};
