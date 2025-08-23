// This configures the @apostrophecms/page module to add a "home" page type to the
// pages menu

export default {
  options: {
    builders: {
      children: true,
      ancestors: {
        children: {
          depth: 2,
          relationships: false
        }
      }
    },
    publicApiProjection: {
      title: 1,
      slug: 1,
      path: 1,
      level: 1,
      rank: 1,
      _url: 1,
      type: 1
    },
    types: [
      {
        name: 'default-page',
        label: 'Default'
      },
      {
        name: 'article-page',
        label: 'Article Page'
      },
      {
        name: '@apostrophecms/home-page',
        label: 'Home'
      }
    ]
  }
};
