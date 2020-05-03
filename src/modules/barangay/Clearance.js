import CONFIG from 'src/config.js'

export default {
  id: 'exportClearance',
  size: 'modal-md',
  title: 'Add New Account',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Full Name',
    variable: 'name',
    placeholder: 'Enter Your Name',
    value: null,
    required: true,
    id: 'worker',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Position',
    variable: 'position',
    placeholder: 'Select Position',
    value: null,
    required: true,
    id: 'position',
    type: 'select_specified',
    options: [
      {
        label: 'Health Worker',
        value: 'health Worker'
      },
      {
        label: 'Barangay Official',
        value: 'Barangay Official'
      }
    ],
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Barangay',
    variable: 'code',
    placeholder: 'Type Barangay Code',
    value: null,
    required: true,
    id: 'code',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: ' ',
  button: {
    left: 'Cancel',
    right: 'Export'
  },
  sort: null,
  params: []
}
