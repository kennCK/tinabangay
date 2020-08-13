import COMMON from 'src/common.js'

export default {
  id: 'createTransportationsModal',
  size: 'modal-md',
  title: 'Add Transportation',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Vehicle Type',
    variable: 'type',
    placeholder: 'Select Vehicle Type',
    value: 'bus',
    required: true,
    id: 'type',
    type: 'select_specified',
    options: COMMON.vehicleTypes,
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Type Model',
    variable: 'model',
    placeholder: 'Enter type model.',
    value: null,
    required: true,
    id: 'model',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Number',
    variable: 'number',
    placeholder: 'Name, Jeep Code, Flight Number, Plate Number and so on.',
    value: null,
    id: 'number',
    type: 'input',
    required: true,
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: 'transportations/create',
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
