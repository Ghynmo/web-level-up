// make environment according needed

var environments = {};

// env pas lgi staging
environments.staging = {
    'HttpPort' : 3000,
    'HttpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : ''
      }
}


// Testing environment
environments.testing = {
  'HttpPort' : 4000,
  'HttpsPort' : 4001,
  'envName' : 'testing',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'NotARealCompany, Inc.',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:4000/'
  }
};

environments.production = {
    'HttpPort' : 5000,
    'HttpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : ''
      }
}

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport