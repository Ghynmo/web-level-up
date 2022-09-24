
var _data = require('../data');
const logs = require('../logs');

// Define all the handlers
var handlers = {};

// crud_template_name Templates
handlers.crud_template_name = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._crud_template_name[data.method](data,callback);
  } else {
    // Error 405 Method Not Allowed
    callback(405);
  }
};

// Container for all the crud_template_name methods
handlers._crud_template_name  = {};

// crud_template_name - post
// Required data: field1, field2
// Optional data: none
handlers._crud_template_name.post = function(data,callback){
  // Check that all required fields are filled out
  var field1 = typeof(data.payload.field1) == 'string' && data.payload.field1.trim().length > 0 ? data.payload.field1.trim() : false;
  var field2 = typeof(data.payload.field2) == 'string' && data.payload.field2.trim().length > 0 ? data.payload.field2.trim() : false;

  if(field1 && field2){
    // Make sure the crud_template_name doesnt already exist
    var crud_template_nameObject = {
      'field1' : field1,
      'field2' : field2,
    };
    // checking into the database
    _data.read('crud_template_name',field1,function(err,data){
      if(err){
          // Store the crud_template_name
          _data.create('crud_template_name',field1,crud_template_nameObject,function(err){
            if(!err){
              callback(200);
              logs.logger.log('info','success create new crud_template_name '+field1);
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not create the new crud_template_name'});
            }
          });

      } else {
        // crud_template_name alread exists
        callback(400,{'Error' : 'A crud_template_name with that field1 number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
    logs.logger.log('error','missing required fields '+field1);
  }

};

// Required data: field1
// Optional data: none
// @TODO Only let an authenticated crud_template_name access their object. Dont let them access anyone elses.
handlers._crud_template_name.get = function(data,callback){
  // Check that field1 number is valid
  var field1 = typeof(data.queryStringObject.field1) == 'string' && data.queryStringObject.field1.trim().length > 0 ? data.queryStringObject.field1.trim() : false;
  if(field1){
    // Checking token is empty?
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // validation token
    handlers._tokens.verifyToken(token,field1,function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the crud_template_name
        _data.read('crud_template_name',field1,function(err,data){
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
// @TODO Only let an authenticated crud_template_name up their object. Dont let them access update elses.
handlers._crud_template_name.put = function(data,callback){
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

          // Lookup the crud_template_name
          _data.read('crud_template_name',field1,function(err,crud_template_nameData){
            if(!err && crud_template_nameData){
              // Update the fields if necessary
              if(field2){
                crud_template_nameData.field2 = field2;
              }
             
              // Store the new updates
              _data.update('crud_template_name',field1,crud_template_nameData,function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500,{'Error' : 'Could not update the crud_template_name.'});
                }
              });
            } else {
              callback(400,{'Error' : 'Specified crud_template_name does not exist.'});
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
// @TODO Only let an authenticated crud_template_name delete their object. Dont let them delete update elses.
// @TODO Cleanup (delete) any other data files associated with the crud_template_name
handlers._crud_template_name.delete = function(data,callback){
  // Check that field1 number is valid
  var field1 = typeof(data.queryStringObject.field1) == 'string' && data.queryStringObject.field1.trim().length == 10 ? data.queryStringObject.field1.trim() : false;
  if(field1){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the field1 number
    handlers._tokens.verifyToken(token,field1,function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the crud_template_name
        _data.read('crud_template_name',field1,function(err,data){
          if(!err && data){
            _data.delete('crud_template_name',field1,function(err){
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not delete the specified crud_template_name'});
              }
            });
          } else {
            callback(400,{'Error' : 'Could not find the specified crud_template_name.'});
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