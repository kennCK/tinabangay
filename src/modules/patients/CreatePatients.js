import COMMON from 'src/common.js'

export default {
  id: 'createPatientsModal',
  size: 'modal-md',
  title: 'Add New Patient',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Username',
    variable: 'username',
    placeholder: 'Enter username',
    value: null,
    required: false,
    id: 'username',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Patient Code',
    variable: 'code',
    placeholder: 'Enter Patient Code',
    value: null,
    required: false,
    id: 'code',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Status',
    variable: 'status',
    placeholder: 'Select Status',
    value: 'tested',
    required: true,
    id: 'status',
    type: 'select_specified',
    options: [{
      value: 'tested',
      label: 'Tested'
    },
    {
      value: 'symptoms',
      label: 'Symptoms'
    },
    {
      value: 'positive',
      label: 'Positive'
    },
    {
      value: 'recovered',
      label: 'Recovered'
    },
    {
      value: 'death',
      label: 'Death'
    },
    {
      value: 'pui',
      label: 'Person Under Investigation'
    },
    {
      value: 'pum',
      label: 'Person Under Monitoring'
    },
    {
      value: 'lsi',
      label: 'Locally Stranded Individuals'
    },
    {
      value: 'rofw',
      label: 'Returning Overseas Filipino Workers'
    },
    {
      value: 'others',
      label: 'Others'
    }],
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Remarks / Symptoms',
    variable: 'remarks',
    placeholder: 'Enter remarks or symptoms',
    value: null,
    required: false,
    id: 'remarks',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Locality',
    variable: 'locality',
    placeholder: 'Enter locality',
    value: null,
    required: true,
    id: 'locality',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Source',
    variable: 'source',
    placeholder: 'Enter Patient Information Source',
    value: null,
    required: false,
    id: 'source',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 0,
      type: 'text'
    }
  }
  ],
  route: 'patients/create',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: [{
    variable: 'payload',
    value: 'manual'
  },
  {
    variable: 'added_by',
    value: null
  }]
}
