
// Define all the handlers
var handlers = {};

// Ping
handlers.ping = function(data,callback){
    callback(200);
};

// Error example (this is why we're wrapping the handler caller in a try catch)
handlers.exampleError = function(data,callback){
  var err = new Error('This is an example error.');
  throw(err);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

module.exports = handlers;