
var _data = require('../data');
const logs = require('../logs');

// Define all the handlers
var handlers = {};

// customers Templates
handlers.customers = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._customers[data.method](data,callback);
  } else {
    // Error 405 Method Not Allowed
    callback(405);
  }
};

// Container for all the customers methods
handlers._customers  = {};

// customers - post
// Required data: field1, field2
// Optional data: none
handlers._customers.post = function(data,callback){
  // Check that all required fields are filled out
  var field1 = typeof(data.payload.field1) == 'string' && data.payload.field1.trim().length > 0 ? data.payload.field1.trim() : false;
  var field2 = typeof(data.payload.field2) == 'string' && data.payload.field2.trim().length > 0 ? data.payload.field2.trim() : false;

  if(field1 && field2){
    // Make sure the customers doesnt already exist
    var customersObject = {
      'field1' : field1,
      'field2' : field2,
    };
    // checking into the database
    _data.read('customers',field1,function(err,data){
      if(err){
          // Store the customers
          _data.create('customers',field1,customersObject,function(err){
            if(!err){
              callback(200);
              logs.logger.log('info','success create new customers '+field1);
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not create the new customers'});
            }
          });

      } else {
        // customers alread exists
        callback(400,{'Error' : 'A customers with that field1 number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
    logs.logger.log('error','missing required fields '+field1);
  }

};

// Required data: field1
// Optional data: none
// @TODO Only let an authenticated customers access their object. Dont let them access anyone elses.
handlers._customers.get = function(data,callback){
  // Check that field1 number is valid
  var field1 = typeof(data.queryStringObject.field1) == 'string' && data.queryStringObject.field1.trim().length > 0 ? data.queryStringObject.field1.trim() : false;
  if(field1){
    // Checking token is empty?
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // validation token
    handlers._tokens.verifyToken(token,field1,function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the customers
        _data.read('customers',field1,function(err,data){
          if(!err && data){
            callback(200,data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403,{"Error" : "Missing required token in header, or token is invalid."})
      }
    })
    
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Required data: field1
// Optional data: field2 (at least one must be specified)
// @TODO Only let an authenticated customers up their object. Dont let them access update elses.
handlers._customers.put = function(data,callback){
  // Check for required field
  var field1 = typeof(data.payload.field1) == 'string' && data.payload.field1.trim().length == 10 ? data.payload.field1.trim() : false;

  // Check for optional fields
  var field2 = typeof(data.payload.field2) == 'string' && data.payload.field2.trim().length > 0 ? data.payload.field2.trim() : false;
  
  // Error if field1 is invalid
  if(field1){
    // Error if nothing is sent to update
    if(field2){

      // Get token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the field1 number
      handlers._tokens.verifyToken(token,field1,function(tokenIsValid){
        if(tokenIsValid){

          // Lookup the customers
          _data.read('customers',field1,function(err,customersData){
            if(!err && customersData){
              // Update the fields if necessary
              if(field2){
                customersData.field2 = field2;
              }
             
              // Store the new updates
              _data.update('customers',field1,customersData,function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500,{'Error' : 'Could not update the customers.'});
                }
              });
            } else {
              callback(400,{'Error' : 'Specified customers does not exist.'});
            }
          });
        } else {
          callback(403,{"Error" : "Missing required token in header, or token is invalid."});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }
};

// Required data: field1
// @TODO Only let an authenticated customers delete their object. Dont let them delete update elses.
// @TODO Cleanup (delete) any other data files associated with the customers
handlers._customers.delete = function(data,callback){
  // Check that field1 number is valid
  var field1 = typeof(data.queryStringObject.field1) == 'string' && data.queryStringObject.field1.trim().length == 10 ? data.queryStringObject.field1.trim() : false;
  if(field1){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the field1 number
    handlers._tokens.verifyToken(token,field1,function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the customers
        _data.read('customers',field1,function(err,data){
          if(!err && data){
            _data.delete('customers',field1,function(err){
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not delete the specified customers'});
              }
            });
          } else {
            callback(400,{'Error' : 'Could not find the specified customers.'});
          }
        });
      } else {
        callback(403,{"Error" : "Missing required token in header, or token is invalid."});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};


module.exports = handlers;