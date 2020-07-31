import common from 'src/common.js'
export default {
  id: 'createSymptomModal',
  size: 'modal-md',
  title: 'Report Symptom',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Date',
    variable: 'date',
    placeholder: 'Enter date',
    value: null,
    required: true,
    id: 'date',
    type: 'date',
    inputType: 'date',
    validation: {
      size: 1,
      type: 'date'
    }
  }, {
    row: 'full',
    label: 'Select type of symptoms',
    variable: 'type',
    placeholder: null,
    value: 0,
    required: true,
    id: 'type',
    type: 'select_specified',
    options: common.symptoms
  }, {
    row: 'full',
    label: 'Enter other details',
    variable: 'remarks',
    placeholder: 'Enter other details here',
    value: 0,
    required: false,
    id: 'remarks',
    type: 'textarea',
    textAreaRows: 10,
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: 'symptoms/create',
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
