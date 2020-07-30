export default {
  sidebarMenu: [
    {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Dashboard', icon: 'fa fa-tachometer', path: 'dashboard', flag: false, subMenu: null},
    {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Plasma Posts', icon: 'fas fa-diagnoses', path: 'plasma/posts', flag: false, subMenu: null},
    {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Dashboard', icon: 'fas fa-tachometer-alt', path: 'dashboard', flag: false, subMenu: null},
//
//
//
    {accountType: 'USER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Visited Places', icon: 'fa fa-map-marker', path: 'places', flag: false, subMenu: null},
    {accountType: 'USER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Temperature', icon: 'fa fa-thermometer-half', path: 'temperature/p', flag: false, subMenu: null},
    {accountType: 'USER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Rides', icon: 'fa fa-car', path: 'rides/p', flag: false, subMenu: null},
    {accountType: 'USER', accountStatus: 'ALL', showOnAdmin: false, description: 'Symptoms Reporting', icon: 'fas fa-diagnoses', path: 'symptoms_reporting', flag: false, subMenu: null},
//
//
//
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Visited Places', icon: 'fa fa-map-marker', path: 'places', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Temperature', icon: 'fa fa-thermometer-half', path: 'temperature/p', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Rides', icon: 'fa fa-car', path: 'rides/p', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'Symptoms Reporting', icon: 'fas fa-diagnoses', path: 'symptoms_reporting', flag: false, subMenu: null},
//
//
//
    // {accountType: 'ADMIN', accountStatus: 'ALL', showOnAdmin: false, description: 'Places', icon: 'fa fa-map', path: 'all-places', flag: false, subMenu: null},
    // {accountType: 'ADMIN', accountStatus: 'ALL', showOnAdmin: false, description: 'Rides', icon: 'fa fa-truck', path: 'all-rides', flag: false, subMenu: null},
    {accountType: 'AGENCY_GOV', accountStatus: 'ALL', showOnAdmin: true, description: 'Tracing', icon: 'fa fa-sitemap', path: 'tracing', flag: false, subMenu: null},
    {accountType: 'AGENCY_GOV', accountStatus: 'ALL', showOnAdmin: true, description: 'Patients', icon: 'fa fa-users', path: 'patients', flag: false, subMenu: null},
    {accountType: 'AGENCY_GOV', accountStatus: 'ALL', showOnAdmin: true, description: 'Locations', icon: 'fa fa-sitemap', path: 'lgu/location/', flag: false, subMenu: null},
    // {accountType: 'AGENCY_GOV', accountStatus: 'ALL', showOnAdmin: true, description: 'Accounts', icon: 'fa fa-users', path: 'accounts', flag: false, subMenu: null},
    {accountType: 'AGENCY_GOV', accountStatus: 'ALL', showOnAdmin: true, description: 'LGU Settings', icon: 'fa fa-sitemap', path: 'lgu/settings', flag: false, subMenu: null},
//
//
//
    {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: true, description: 'Contract Tracing', icon: 'fa fa-sitemap', path: 'b/tracing/', flag: false, subMenu: null},
    {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: false, description: 'Locations', icon: 'fa fa-sitemap', path: 'business/location/', flag: false, subMenu: null},
    {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: false, description: 'Business Settings', icon: 'fa fa-sitemap', path: 'business/settings', flag: false, subMenu: null},
    // {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: true, description: 'Sanitary Schedule', icon: 'far fa-calendar', path: 'business/schedule', flag: false, subMenu: null},
//
//
//
    // {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Feedback', icon: 'fa fa-comment', path: 'feedback', flag: false, subMenu: null},
    {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Tracing', icon: 'fa fa-sitemap', path: 'tracing', flag: false, subMenu: null},
    {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Patients', icon: 'fa fa-users', path: 'patients', flag: false, subMenu: null},
    {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Locations', icon: 'fa fa-sitemap', path: 'barangay/location/', flag: false, subMenu: null},
    // {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Accounts', icon: 'fa fa-users', path: 'accounts', flag: false, subMenu: null},
    {accountType: 'AGENCY_BRGY', accountStatus: 'ALL', showOnAdmin: false, description: 'Barangay Settings', icon: 'fa fa-sitemap', path: 'barangay/settings', flag: false, subMenu: null},
//
//
//
    {accountType: 'ADMIN', accountStatus: 'ALL', showOnAdmin: true, description: 'Accounts', icon: 'fa fa-users', path: 'admin/accounts', flag: false, subMenu: null},
    {accountType: 'ADMIN', accountStatus: 'ALL', showOnAdmin: true, description: 'Barangays', icon: 'fa fa-building', path: 'admin/barangays', flag: false, subMenu: null}
  ],
  profileMenu: [{
    title: 'My Profile',
    icon: 'fa fa-cog',
    route: '/profile'
  }, {
    title: 'Employees',
    icon: 'fa fa-users',
    route: '/linked_accounts'
  }, {
    title: 'Invite Friends',
    icon: 'fa fa-users',
    route: '/referrals'
  }],
  implementedLocality: 'Cebu City, Consolacion, Mandaue City, Minglanilla, Lapu-Lapu City, Liloan, Talisay Cebu',
  APP_NAME: 'BirdsEye',
  APP_NAME_HTML: 'BirdsEye',
  APP_EMAIL: 'support@birds-eye.org',
  COMPANY: 'BirdsEye',
  COMPANY_URL: 'https://birds-eye.org',
  APP_URL: 'https://birds-eye.org',
  COPYRIGHT: 'BirdsEye ' + new Date().getFullYear(),
  USER_TYPE: [{
    title: 'USER'
  }, {
    title: 'AGENCY'
  }],
  plan: false,
  header: ['status', 'notification'], // 'messenger', '',
  settingsMenu: [
    {title: 'Profile', type: 'profile', allowed: ['cellular_number', 'address', 'sex', 'birth_date']},
    {title: 'Account', type: 'account', allowed: []}
  ],
  referral: {
    message: 'and let\'s be one in fighting COVID-19. ',
    emailMessage: '.They can trace and have an birdseye view for COVID-19. Let\'s spread the good news!'
  },
  socialMedia: {
    facebook: 'birdseyeph'
  },
  pusher: {
    channel: 'birdseye',
    notifications: 'Notifications',
    messages: 'Message',
    validation: 'Validation'
  },
  vehicleTypes: [{
    label: 'Bus',
    value: 'bus'
  }, {
    label: 'Bicycle',
    value: 'bicycle'
  }, {
    label: 'Plane',
    value: 'plane'
  }, {
    label: 'Jeepney',
    value: 'jeep'
  }, {
    label: 'Private Car',
    value: 'private_car'
  }, {
    label: 'Motorcycle',
    value: 'motorcycle'
  }, {
    label: 'Grab/Angkas',
    value: 'grab/angkas'
  }, {
    label: 'Shippings',
    value: 'shppings'
  }, {
    label: 'Train',
    value: 'train'
  }, {
    label: 'Taxi',
    value: 'taxi'
  }, {
    label: 'Tricycle',
    value: 'tricycle'
  }, {
    label: 'Van',
    value: 'van'
  }, {
    label: 'Others',
    value: 'others'
  }],
  symptomsHealthDec: [{
    label: 'Fever',
    translate: 'Lagnat',
    value: 'fever'
  }, {
    label: 'Headache',
    translate: 'Sakit ng ulo',
    value: 'headache'
  }, {
    label: 'Sore Throat',
    translate: 'Namamagang lalamunan',
    value: 'sore_throat'
  }, {
    label: 'Cough',
    translate: 'Ubo'
  }, {
    label: 'Difficulty of Breathing',
    translate: 'Kahirapan sa paghinga',
    value: 'difficulty_of_breathing'
  }, {
    label: 'Body Weakness',
    translate: 'Paghihina ng katawan',
    value: 'body_weakness'
  }, {
    label: 'Unexplained Bruising or Bleeding',
    translate: 'hindi maipaliwanag na mga pasa',
    value: 'unexplained_bruising_or_bleeding'
  }, {
    label: 'Severe Diarrhea',
    translate: 'Matinding pagtatae',
    value: 'severe_diarrhea'
  }],
  symptoms: [{
    label: 'Fever',
    value: 'fever'
  }, {
    label: 'LBM',
    value: 'lbm'
  }, {
    label: 'Cough and Colds',
    value: 'cough and colds'
  }, {
    label: 'Sore Throat',
    value: 'sore throat'
  }, {
    label: 'Others',
    value: 'others'
  }],
  healthDec: {
    personalInformation: {
      first_name: null,
      last_name: null,
      middle_name: null,
      gender: null,
      birth_date: null,
      civil_status: null,
      occupation: null,
      contact_number: null,
      email: null,
      address: null
    },
    travelHistory: {
      transportation: [],
      countries: [],
      localities: []
    },
    symptoms: [],
    safety_questions: [],
    company: {
      person_in_contact: [],
      related_questions: []
    }
  },
  broadcastingFlag: true,
  passwordLimit: 8,
  alertFlag: false
}
