import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  id: 'createPlacesModal',
  size: 'modal-md',
  title: 'Add Places',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Latitude',
    variable: 'latitude',
    placeholder: 'Enter Latitude',
    value: null,
    required: true,
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
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Date',
    variable: 'date',
    placeholder: 'Enter date',
    value: null,
    required: true,
    id: 'longitude',
    type: 'input',
    inputType: 'date',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Time',
    variable: 'time',
    placeholder: 'Enter time',
    value: null,
    required: true,
    id: 'time',
    type: 'input',
    inputType: 'time',
    validation: {
      size: 1,
      type: 'text'
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
