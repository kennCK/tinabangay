
export default{
  routes: [{
    path: '/signup',
    name: 'signup',
    component: resolve => require(['components/increment/basic/Signup.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/signup/:email/:code',
    name: 'signup',
    component: resolve => require(['components/increment/basic/Signup.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/signup_partner',
    name: 'signupPartner',
    component: resolve => require(['components/increment/basic/SignupPartner.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/verification/:email',
    name: 'verification',
    component: resolve => require(['components/increment/basic/Verification.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/login_verification/:username/:code',
    name: 'loginVerification',
    component: resolve => require(['components/increment/basic/LoginByVerification.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/login',
    name: 'loginAccount',
    component: resolve => require(['components/increment/basic/LogInBasic.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/home',
    name: 'landing',
    component: resolve => require(['modules/home/Landing.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/request_reset_password',
    name: 'requestResetPassword',
    component: resolve => require(['components/increment/basic/RequestResetPassword.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/reset_password/:username/:code',
    name: 'resetPassword',
    component: resolve => require(['components/increment/basic/ResetPassword.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: resolve => require(['modules/dashboard/Dashboard.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/profile/:parameter?',
    name: 'profile',
    component: resolve => require(['components/increment/settings/UpdateBasic.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/referrals/',
    name: 'referrals',
    component: resolve => require(['components/increment/generic/referral/Referrals.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/places/',
    name: 'places',
    component: resolve => require(['modules/places/Places.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/patients/',
    name: 'patients',
    component: resolve => require(['modules/patients/Patients.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/tracing/',
    name: 'tracing',
    component: resolve => require(['modules/tracing/ContactTracing.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/b/tracing/',
    name: 'tracingBusiness',
    component: resolve => require(['modules/tracing/ContactTracingBusiness.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/temperature/',
    name: 'temperature',
    component: resolve => require(['modules/tracing/Temperature.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/temperature/p',
    name: 'temperaturePersonal',
    component: resolve => require(['modules/temperature/Temperature.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/rides/p',
    name: 'ridesPersonal',
    component: resolve => require(['modules/rides/Personal.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/places/trend',
    name: 'placesTrend',
    component: resolve => require(['modules/places/TrendAll.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/admin/accounts',
    name: 'adminAccounts',
    component: resolve => require(['modules/admin/Accounts.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }, {
    path: '/admin/barangays',
    name: 'barangays',
    component: resolve => require(['modules/admin/Barangays.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/all-places',
    name: 'hotspots',
    component: resolve => require(['modules/admin/Hotspots.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/all-rides',
    name: 'allRides',
    component: resolve => require(['modules/admin/Rides.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/accounts',
    name: 'subAccounts',
    component: resolve => require(['modules/barangay/Accounts.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/linked_accounts',
    name: 'linkedAccounts',
    component: resolve => require(['modules/linkedAccounts/LinkedAccounts.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/symptoms_reporting',
    name: 'symptomsReporting',
    component: resolve => require(['modules/symptoms/List.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: resolve => require(['modules/barangay/Feedback.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/form/:code',
    name: 'healthDeclaration',
    component: resolve => require(['modules/business/HealthDeclaration.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/lgu/settings',
    name: 'lguSettings',
    component: resolve => require(['components/increment/settings/MerchantDirect.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/barangay/settings',
    name: 'barangaySettings',
    component: resolve => require(['components/increment/settings/MerchantDirect.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/business/settings',
    name: 'businessSettings',
    component: resolve => require(['components/increment/settings/MerchantDirect.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/b/patients',
    name: 'bPatients',
    component: resolve => require(['modules/patients/Brgy.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/scanned/:payload/:code',
    name: 'scannedUser',
    component: resolve => require(['modules/scan/ScannedResult.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/business/location',
    name: 'bLocations',
    component: resolve => require(['modules/location/List.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/business/vehicles',
    name: 'bVehicles',
    component: resolve => require(['modules/rides/Vehicles.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/lgu/location',
    name: 'bLocations',
    component: resolve => require(['modules/location/List.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/barangay/location',
    name: 'bLocations',
    component: resolve => require(['modules/location/List.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/plasma/posts',
    name: 'pPosts',
    component: resolve => require(['modules/plasma/plasma.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/business/schedule',
    name: 'Schedule',
    component: resolve => require(['modules/business/SanitarySchedule.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
  {
    path: '/refer_register/:email/:code',
    name: 'referRegister',
    component: resolve => require(['components/increment/basic/Referral.vue'], resolve),
    meta: {
      tokenRequired: false
    }
  }
  ]
}
