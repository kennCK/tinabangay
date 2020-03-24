export default {
  sidebarMenu: [
    {accountType: 'ALL', accountStatus: 'ALL', description: 'Dashboard', icon: 'fa fa-tachometer', path: 'dashboard', flag: false, subMenu: null}
  ],
  profileMenu: [{
    title: 'My Profile',
    icon: 'fa fa-cog',
    route: '/profile'
  }, {
    title: 'Invite Friends',
    icon: 'fa fa-users',
    route: '/referrals'
  }],
  APP_NAME: 'BIRDSEYE',
  APP_NAME_HTML: 'BIRDSEYE',
  APP_EMAIL: 'support@increment.ltd',
  COMPANY: 'Increment Technologies',
  COMPANY_URL: 'www.increment.ltd',
  COPYRIGHT: 'BIRDSEYE ' + new Date().getFullYear(),
  USER_TYPE: [{
    title: 'USER'
  }, {
    title: 'AGENCY'
  }],
  plan: false,
  header: ['status', 'notification'], // 'messenger', '',
  settingsMenu: [
    {title: 'Profile', type: 'profile', allowed: ['cellular_number', 'address', 'sex', 'birth_date']},
    {title: 'Educations', type: 'educations', allowed: []},
    {title: 'Work Experience', type: 'work-experience', allowed: []},
    {title: 'Idenfication Cards', type: 'identifications', allowed: []},
    {title: 'Guarantor', type: 'guarantor', allowed: []},
    {title: 'Account', type: 'account', allowed: []},
    {title: 'Payment Accounts', type: 'payment_method', allowed: []},
    {title: 'Billing Information', type: 'billing_information', allowed: []},
    // {title: 'Merchant Setting', type: 'merchant', allowed: []},
    {title: 'Notifications', type: 'notification', allowed: []}
  ],
  referral: {
    message: 'to help them in case of emergency.',
    emailMessage: '.They help me to manage my investments and allow me to borrow money and approved instantly by other investors. It\'s awesome.'
  },
  socialMedia: {
    facebook: 'birdseye'
  },
  pusher: {
    channel: 'birdseye',
    notifications: 'Notifications',
    messages: 'Message',
    validation: 'Validation'
  }
}
