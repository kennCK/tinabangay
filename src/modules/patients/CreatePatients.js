import COMMON from 'src/common.js'

export default {
  id: 'createPatientsModal',
  size: 'modal-md',
  title: 'Add New Patient',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Username',
    variable: 'username',
    placeholder: 'Enter username',
    value: null,
    required: true,
    id: 'username',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Status',
    variable: 'status',
    placeholder: 'Select Status',
    value: 'tested',
    required: true,
    id: 'status',
    type: 'select_specified',
    options: [{
      value: 'tested',
      label: 'Tested'
    },
    {
      value: 'positive',
      label: 'Positive'
    },
    {
      value: 'negative',
      label: 'Negative'
    },
    {
      value: 'pui',
      label: 'Person Under Investigation'
    },
    {
      value: 'pum',
      label: 'Person Under Monitoring'
    },
    {
      value: 'death',
      label: 'Deceased'
    }],
    validation: {
      size: 1,
      type: 'text'
    }
  }
  ],
  route: 'patients/create',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: [{
    variable: 'account_id',
    value: null
  }, {
    variable: 'payload',
    value: 'manual'
  },
  {
    variable: 'added_by',
    value: null
  }]
}
