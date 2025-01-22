export default {
  options: {
    locales: {
      en: {
        label: 'English'
      },
      fr: {
        label: 'French',
        prefix: '/fr'
      },
      es: {
        label: 'Spanish',
        prefix: '/es'
      },
      de: {
        label: 'German',
        prefix: '/de'
      }
    },
    adminLocales: [
      // you can add an object for as many or few of the locales as desired
      // the user will only be able to select from these locales in the personal preferences menu
      {
        label: 'English',
        value: 'en'
      },
      {
        label: 'Spanish',
        value: 'es'
      },
      {
        label: 'French',
        value: 'fr'
      },
      {
        label: 'German',
        value: 'de'
      }
    ]
  }
};
