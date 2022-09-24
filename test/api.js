/*
 * API Tests
 *
 */

// Dependencies
var app = require('./../index');
var assert = require('assert');
var http = require('http');
var config = require('./../lib/config');

// Holder for Tests
var api = {};

// Helpers
var helpers = {};
helpers.makeGetRequest = function(path,callback){
  // Configure the request details
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : config.HttpPort,
    'method' : 'GET',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json'
    }
  };
  // Send the request
  var req = http.request(requestDetails,function(res){
      callback(res);
  });
  req.end();
};

helpers.makeGetRequestWithToken = function(path,callback){
  var tokenId = helpers.createRandomString(20);
  var expires = Date.now() + 1000 * 60 * 60;
  var tokenObject = {
    'phone' : 6288877766655,
    'id' : tokenId,
    'expires' : expires
  };

  // Store the token
  _data.create('tokens',tokenId,tokenObject,function(err){
    if(!err){
      callback(200,tokenObject);
    } else {
      callback(500,{'Error' : 'Could not create the new token'});
    }
  });
  
  // Configure the request details
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : config.HttpPort,
    'method' : 'GET',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json',
      'token' : ''//create token
    }
  };
  // Send the request
  var req = http.request(requestDetails,function(res){
      callback(res);
  });
  req.end();
};

helpers.makePostRequest = function(path,callback){
  // Configure the request details
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : config.HttpPort,
    'method' : 'POST',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json'
    }
  };
  // Send the request
  var req = http.request(requestDetails,function(res){
      callback(res);
  });
  req.end();
};

// The main init() function should be able to run without throwing.
api['app.init should start without throwing'] = function(done){
  assert.doesNotThrow(function(){
    app.init(function(err){
      done();
    })
  },TypeError);
};

// Make a request to /ping
api['/ping should respond to GET with 200'] = function(done){
  helpers.makeGetRequest('/ping',function(res){
    assert.equal(res.statusCode,200);
    done();
  });
};

// Make a request to /users
api['/users should respond to GET with 400'] = function(done){
  helpers.makeGetRequest('/users',function(res){
    assert.equal(res.statusCode,400);
    done();
  });
};

api['/users should respond to POST with 400'] = function(done){
  helpers.makeGetRequest('/users',function(res){
    assert.equal(res.statusCode,400);
    done();
  });
};

// Make a request to a random path
api['A random path should respond to GET with 404'] = function(done){
  helpers.makeGetRequest('/this/path/shouldnt/exist',function(res){
    assert.equal(res.statusCode,404);
    done();
  });
};


// Export the tests to the runner
module.exports = api;