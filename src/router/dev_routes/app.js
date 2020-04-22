
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
    component: resolve => require(['modules/tracing/Places.vue'], resolve),
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
  },
  {
    path: '/all-places',
    name: 'hotspots',
    component: resolve => require(['modules/admin/Hotspots.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  }
  ]
}
