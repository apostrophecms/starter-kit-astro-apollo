export default {
  options: {
    subforms: {
      title: {
        fields: [ 'title' ],
        protection: true,
        reload: true
      },
      changePassword: {
        fields: [ 'password' ]
      }
    },

    groups: {
      account: {
        label: 'Account',
        subforms: [ 'title', 'changePassword' ]
      }
    }
  }
};
