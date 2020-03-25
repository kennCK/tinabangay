export default {
  id: 'createPlacesModal',
  size: 'modal-md',
  title: 'Add Places',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Location',
    variable: 'location',
    placeholder: 'Set location',
    value: null,
    required: true,
<<<<<<< HEAD
    id: 'latitude',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Longitude',
    variable: 'longitude',
    placeholder: 'Enter Longitude',
    value: null,
    required: true,
    id: 'longitude',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Route',
    variable: 'route',
    placeholder: 'Enter Route',
    value: null,
    required: true,
    id: 'route',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Locality',
    variable: 'locality',
    placeholder: 'Enter Locality',
    value: null,
    required: true,
    id: 'locality',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Country',
    variable: 'country',
    placeholder: 'Enter Country',
    value: null,
    required: true,
    id: 'country',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Positive Cases Count',
    variable: 'PositiveCount',
    placeholder: 'Enter Number Of Positive cases',
    value: null,
    required: true,
    id: 'PositiveCount',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Region',
    variable: 'region',
    placeholder: 'Enter Region',
    value: null,
    required: true,
    id: 'region',
    type: 'input',
=======
    id: 'location',
    type: 'location',
>>>>>>> 9c591c8b7cdb71ab27362070055dc7b0b2448cd8
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
