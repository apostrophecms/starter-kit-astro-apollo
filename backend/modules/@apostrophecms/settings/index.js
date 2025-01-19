export default {
  options: {
    subforms: {
      changePassword: {
        // This will have `protection: true` automatically.
        fields: [ 'password' ]
      },
      displayName: {
        // The default `title` field is labeled 'Display Name' in the `@apostrophecms/user` module.
        // Changing this field will **not** change the Username or Slug of the user.
        fields: [ 'title' ],
        reload: true
      },
      fullName: {
        // Passing in a label so that it doesn't use the label for `lastName`
        // These fields need to be added to the user schema
        label: 'Full Name',
        // Schema fields added at project level
        fields: [ 'lastName', 'firstName' ],
        preview: '{{ firstName }} {{lastName}}'
      },
      // The `adminLocales` option **must** be configured in the `@apostrophecms/i18n` module for this to be allowed
      adminLocale: {
        fields: [ 'adminLocale' ]
      }
    },
    groups: {
      account: {
        label: 'Account',
        subforms: [ 'displayName', 'fullName', 'changePassword' ]
      },
      preferences: {
        label: 'Preferences',
        // The `adminLocales` option **must** be configured in the `@apostrophecms/i18n` module for this to be allowed
        subforms: [ 'adminLocale' ]
      }
    }
  }
};
