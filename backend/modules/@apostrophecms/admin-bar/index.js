export default {
  options: {
    groups: [
      {
        name: 'media',
        label: 'Media',
        items: [
          '@apostrophecms/image',
          '@apostrophecms/file',
          '@apostrophecms/image-tag',
          '@apostrophecms/file-tag'
        ]
      },
      {
        name: 'blog',
        label: 'Blog',
        items: [
          'article',
          'author'
        ]
      }
    ]
  }
};
