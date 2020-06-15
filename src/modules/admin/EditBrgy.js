export default {
  id: 'editBrgyModal',
  size: 'modal-md',
  title: 'Edit Barangay Information',
  background: null,
  inputs: [{
    row: 'full',
    label: 'UACS Code',
    variable: 'code',
    placeholder: 'Add UACS Code',
    value: null,
    required: true,
    id: 'edit-code',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Route',
    variable: 'route',
    placeholder: 'Add Route',
    value: null,
    required: true,
    id: 'route',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Locality',
    variable: 'locality',
    placeholder: 'Add Locality',
    value: null,
    required: true,
    id: 'locality',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Country',
    variable: 'country',
    placeholder: 'Add Country',
    value: null,
    required: true,
    id: 'country',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Region',
    variable: 'region',
    placeholder: 'Add region',
    value: null,
    required: true,
    id: 'region',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: 'brgy_codes/update',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: []
}
