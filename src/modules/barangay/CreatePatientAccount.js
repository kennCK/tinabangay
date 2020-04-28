import CONFIG from 'src/config.js'

export default {
  id: 'createAccountModal',
  size: 'modal-md',
  title: 'Add New Account',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Username',
    variable: 'username',
    placeholder: 'Enter Username',
    value: null,
    required: true,
    id: 'username',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Password',
    variable: 'password',
    placeholder: 'Enter Password',
    value: null,
    required: true,
    id: 'password',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  },
  {
    row: 'full',
    label: 'Email',
    variable: 'email',
    placeholder: 'Enter Email',
    value: null,
    required: true,
    id: 'email',
    type: 'input',
    inputType: 'email',
    validation: {
      size: 1,
      type: 'email'
    }
  }],
  route: 'accounts/create',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: [{
    variable: 'config',
    value: CONFIG
  }, {
    variable: 'account_type',
    value: 'USER'
  },
  {
    variable: 'referral_code',
    value: null
  },
  {
    variable: 'status',
    value: 'ADDED'
  }]
}
