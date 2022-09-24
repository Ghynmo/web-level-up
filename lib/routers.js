

// !!! DON'T DELETE THIS COMMENTS [This is Regular Expression] 
// Automatic Dependencies will inserted below 
  var customers = require("./handlers/customers")
  var users = require("./handlers/users")
  var handlers = require('./handlers/handlers')

var router = {
// !!! DON'T DELETE THIS COMMENTS [This is Regular Expression] 
// Automatic Router will inserted below
  "customers": customers.customers,
  "users": users.users,
  "tokens": users.tokens,
  "checks": users.checks,
  "ping": handlers.ping,
  "exampleError": handlers.exampleError,
  "notFound": handlers.notFound,
}


module.exports = router
// Note : if error occur when creating new routes with CLI, please check lib/cli.js