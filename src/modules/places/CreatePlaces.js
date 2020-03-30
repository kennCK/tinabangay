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
    type: 'location_non_concatenated',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'location_non_concatenated'
    }
  }, {
    row: 'full',
    label: 'Date',
    variable: 'date',
    placeholder: 'Enter Date',
    disable: 'after',
    required: true,
    value: null,
    id: 'date',
    type: 'date',
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
    type: 'time',
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
