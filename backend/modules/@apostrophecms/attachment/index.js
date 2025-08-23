export default {
  options: {
    publicApiProjection: {
      title: 1,
      name: 1,
      extension: 1,
      _urls: 1,
      group: 1,
      createdAt: 1
    },
    addFileGroups: [
      {
        name: 'videos',
        label: 'Videos',
        extensions: [
          'mp4',
          'webm',
          'gif'
        ],
        extensionMaps: {}
      }
    ]
  }
};
