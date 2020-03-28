export default {
  id: 'createPlacesModal',
  size: 'modal-md',
  title: 'Add Places',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Location',
    variable: 'location',
    placeholder: 'Add Location',
    value: null,
    required: true,
    id: 'location',
    type: 'location',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'location'
    }
  }, {
    row: 'full',
    label: 'Date',
    variable: 'date',
    placeholder: 'Enter Date',
    value: null,
    id: 'date',
    type: 'input',
    inputType: 'date',
    validation: {
      size: 1,
      type: 'date'
    }
  }, {
    row: 'full',
    label: 'Time',
    variable: 'time',
    placeholder: 'Enter Time',
    value: null,
    id: 'time',
    type: 'input',
    inputType: 'time',
    validation: {
      size: 1,
      type: 'time'
    }
  }],
  route: 'visited_places/create',
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
