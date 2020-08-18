export default {
  sidebarMenu: [
    {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Dashboard', icon: 'fa fa-tachometer-alt', path: 'dashboard', flag: false, subMenu: null},
    // {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Plasma Posts', icon: 'fas fa-diagnoses', path: 'plasma/posts', flag: false, subMenu: null},
    // {accountType: 'ALL', accountStatus: 'ALL', showOnAdmin: true, description: 'Dashboard', icon: 'fas fa-tachometer-alt', path: 'dashboard', flag: false, subMenu: null},
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
    {accountType: 'BUSINESS_AUTHORIZED', accountStatus: 'ALL', showOnAdmin: true, description: 'Contact Tracing', icon: 'fa fa-sitemap', path: 'b/tracing/', flag: false, subMenu: null},
    {accountType: 'BUSINESS_AUTHORIZED', accountStatus: 'ALL', showOnAdmin: false, description: 'My Visited Places', icon: 'fa fa-map-marker', path: 'places', flag: false, subMenu: null},
    {accountType: 'BUSINESS_AUTHORIZED', accountStatus: 'ALL', showOnAdmin: false, description: 'My Temperature', icon: 'fa fa-thermometer-half', path: 'temperature/p', flag: false, subMenu: null},
    {accountType: 'BUSINESS_AUTHORIZED', accountStatus: 'ALL', showOnAdmin: false, description: 'My Rides', icon: 'fa fa-car', path: 'rides/p', flag: false, subMenu: null},
    {accountType: 'BUSINESS_AUTHORIZED', accountStatus: 'ALL', showOnAdmin: false, description: 'Symptoms Reporting', icon: 'fas fa-diagnoses', path: 'symptoms_reporting', flag: false, subMenu: null},
//
//
//
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Visited Places', icon: 'fa fa-map-marker', path: 'places', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Temperature', icon: 'fa fa-thermometer-half', path: 'temperature/p', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: false, description: 'My Rides', icon: 'fa fa-car', path: 'rides/p', flag: false, subMenu: null},
    {accountType: 'TEMP_SCANNER', accountStatus: 'ALL', showOnAdmin: true, description: 'Symptoms Reporting', icon: 'fas fa-diagnoses', path: 'symptoms_reporting', flag: false, subMenu: null},
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
    {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: true, description: 'Contact Tracing', icon: 'fa fa-sitemap', path: 'b/tracing/', flag: false, subMenu: null},
    {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: false, description: 'Locations', icon: 'fa fa-sitemap', path: 'business/location/', flag: false, subMenu: null},
    // {accountType: 'BUSINESS', accountStatus: 'ALL', showOnAdmin: false, description: 'Vehicles', icon: 'fa fa-sitemap', path: 'business/vehicles/', flag: false, subMenu: null},
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
    value: 'fever',
    description: 'Recognizing a fever can enable you to get treatment and proper monitoring for it. Normal body temperature is typically around 37°C. However, the normal body temperature for each person can vary slightly.'
  }, {
    label: 'Headache',
    translate: 'Sakit ng ulo',
    value: 'headache',
    description: 'A headache is a very common condition that causes pain and discomfort in the head, scalp, or neck. It’s estimated that 7 in 10 people have at least one headache each year. Headaches can sometimes be mild, but in many cases, they can cause severe pain that makes it difficult to concentrate at work and perform other daily activities. In fact, approximately 45 million Americans frequently have severe headaches that can be disabling. Luckily, most headaches can be managed with medication and lifestyle changes.'
  }, {
    label: 'Sore Throat',
    translate: 'Namamagang lalamunan',
    value: 'sore_throat',
    description: 'A sore throat is a painful, dry, or scratchy feeling in the throat Pain in the throat is one of the most common symptoms. It accounts for more than 13 million visits to doctor’s offices each year (1Trusted Source). Most sore throats are caused by infections, or by environmental factors like dry air. Although a sore throat can be uncomfortable, it’ll usually go away on its own.'
  }, {
    label: 'Cough',
    translate: 'Ubo',
    value: 'cough',
    description: 'Coughing is your body’s way of getting rid of an irritant. When something irritates your throat or airway, your nervous system sends an alert to your brain. Your brain responds by telling the muscles in your chest and abdomen to contract and expel a burst of air. Coughing is a symptom of many illnesses and conditions. Sometimes, the characteristics of your cough can give you a clue to its cause.'
  }, {
    label: 'Difficulty of Breathing',
    translate: 'Kahirapan sa paghinga',
    value: 'difficulty_of_breathing',
    description: 'Experiencing breathing difficulty describes discomfort when breathing and feeling as if you can’t draw a complete breath. This can develop gradually or come on suddenly. Mild breathing problems, such as fatigue after an aerobics class, don’t fall into this category. It’s important to note that frequent episodes of shortness of breath or sudden, intense breathing difficulty may be signs of a serious health issue that needs medical attention. You should discuss any breathing concerns with your doctor.'
  }, {
    label: 'Body Weakness',
    translate: 'Paghihina ng katawan',
    value: 'body_weakness',
    description: 'Fatigue is a term used to describe an overall feeling of tiredness or lack of energy. It isn’t the same as simply feeling drowsy or sleepy. When you’re fatigued, you have no motivation and no energy. Being sleepy may be a symptom of fatigue, but it’s not the same thing. If your fatigue doesn’t resolve with proper rest and nutrition, or you suspect it’s caused by an underlying physical or mental health condition, see your doctor. They can help diagnose the cause of your fatigue and work with you to treat it.'
  }, {
    label: 'Loss of taste and smell',
    translate: 'Pagkawala ng lasa at amoy',
    value: 'loss_of_taste_and_smell',
    description: 'Impaired taste means that your sense of taste is not functioning properly. Impaired taste can refer to the absence of taste. It can also refer to an altered sense, such as a metallic taste in the mouth. Causes of impaired taste range from the common cold to more serious medical conditions involving the central nervous system. Impaired taste can also be a sign of normal aging. Anosmia is the partial or complete loss of the sense of smell. This loss may be temporary or permanent. Common conditions that irritate the nose’s lining, such as allergies or a cold, can lead to temporary anosmia.'
  }, {
    label: 'Muscle Pain',
    translate: 'Sakit ng kalamnan',
    value: 'muscle_pain',
    description: 'Muscle aches (myalgia) are extremely common. Almost everyone has experienced discomfort in their muscles at some point. Because there’s muscle tissue in nearly all parts of the body, this type of pain can be felt practically anywhere. However, there’s no single cause for muscle aches and pains'
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
