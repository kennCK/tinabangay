import COMMON from 'src/common.js'

export default {
  id: 'createPatientsModal',
  size: 'modal-md',
  title: 'Add Rides',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Username',
    variable: 'username',
    placeholder: 'Enter username',
    value: '',
    required: true,
    id: 'account_id',
    type: 'textarea',
    // options: COMMON.vehicleTypes,
    validation: {
      size: 1,
      type: 'text'
    }
  }],
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
  }]
}
