import COMMON from 'src/common.js'

export default {
  id: 'createRidesModal',
  size: 'modal-md',
  title: 'Add Rides',
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
    label: 'Code',
    variable: 'code',
    placeholder: 'Name, Jeep Code, Flight Number, Plate Number and so on.',
    value: null,
    required: true,
    id: 'code',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'From (Location)',
    variable: 'from',
    placeholder: 'Set location',
    value: null,
    id: 'from',
    type: 'location_concatenated',
    required: true,
    inputType: 'text',
    validation: {
      size: 1,
      type: 'location_concatenated'
    }
  }, {
    row: 'full',
    label: 'From (Date and Time)',
    variable: 'from_date_time',
    placeholder: 'Enter date and time of departure',
    value: null,
    id: 'from_date_time',
    type: 'datetime',
    required: true,
    validation: {
      size: 1,
      type: 'datetime'
    }
  }, {
    row: 'full',
    label: 'To (Location)',
    variable: 'to',
    placeholder: 'Set location',
    value: null,
    id: 'to',
    type: 'location_concatenated',
    inputType: 'text',
    required: true,
    validation: {
      size: 1,
      type: 'location_concatenated'
    }
  }, {
    row: 'full',
    label: 'To (Date and Time)',
    variable: 'to_date_time',
    placeholder: 'Enter date of arrival',
    value: null,
    id: 'to_date_time',
    required: true,
    type: 'datetime',
    validation: {
      size: 1,
      type: 'datetime'
    }
  }],
  route: 'rides/create',
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
