export default {
  fields: {
    add: {
      backgroundColor: {
        type: 'color',
        label: 'Page Background',
        selector: 'body',
        property: 'color'
      }
    },
    group: {
      colors: {
        label: 'Colors',
        fields: ['backgroundColor']
      }
    }
  }
};
