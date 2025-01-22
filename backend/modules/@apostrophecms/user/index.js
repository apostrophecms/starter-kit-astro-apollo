export default {
  fields: {
    add: {
      firstName: {
        type: 'string',
        label: 'First Name'
      },
      lastName: {
        type: 'string',
        label: 'Last Name'
      }
    },
    group: {
      account: {
        label: 'Account',
        fields: [
          'firstName',
          'lastName'
        ]
      }
    }
  }
};
