
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  id: 'updatePatientModal',
  size: 'modal-md',
  title: 'Update Requests',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Status',
    variable: 'status',
    placeholder: '',
    value: null,
    required: true,
    id: 'status',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Date Recorded',
    variable: 'date',
    placeholder: '',
    value: null,
    required: true,
    id: 'date',
    type: 'input',
    inputType: 'date',
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
  }]
}
