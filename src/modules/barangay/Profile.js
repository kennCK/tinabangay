export default {
  id: 'updateUser',
  size: 'modal-md',
  title: 'Edit User Information',
  background: null,
  inputs: [{
    row: 'full',
    label: 'First Name',
    variable: 'first_name',
    placeholder: 'Enter First Name',
    value: null,
    required: true,
    id: 'first_name',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Middle Name',
    variable: 'middle_name',
    placeholder: 'Enter Middle Name',
    value: null,
    required: true,
    id: 'middle_name',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Last Name',
    variable: 'last_name',
    placeholder: 'Enter Last Name',
    value: null,
    required: true,
    id: 'last_name',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Gender',
    variable: 'sex',
    placeholder: 'Choose Gender',
    value: 'male',
    required: true,
    id: 'gender',
    type: 'select_specified',
    options: [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      },
      {
        label: 'Others',
        value: 'others'
      }
    ],
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: 'account_informations/update',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: [
    {
      variable: 'account_id',
      value: null
    },
    {
      variable: 'id',
      value: null
    }
  ]
}
