
// Requirement package
    // for create the server
    var http = require('http');
    var https = require('https');
    // for getting information from url
    var url = require('url');
    // for getting information from payload / raw parameter (in the body)
    var stringDecoder = require('string_decoder').StringDecoder;
    var config = require('./config');
    var fs = require('fs')
    var handlers = require('./handlers/handlers');
    var helpers = require('./helpers');
    var path = require('path');
    var util = require('util');
    var debug = util.debuglog('server');
    var routers = require('./routers');

var server = {};

// Create HTTP server
server.httpServer = http.createServer(function(req,res) {
    server.unifiedServer(req,res);
})

// create HTTPs server
server.httpsOptions = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}
server.httpsServer = https.createServer(server.httpsOptions,function(req,res){
    server.unifiedServer(req,res);
})


server.unifiedServer = function(req,res) {
// Start to send the request
    // - get request information are sending from url
    var parsedUrl = url.parse(req.url, true);
    // -- get the path name
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    // -- get the params(query string[/foo?fizz=buzz]) on url
    var queryStringObject = parsedUrl.query;
    // - get the method
    var method = req.method.toLocaleLowerCase();
    // - get the header
    var headers = req.headers;

    // - if any, get the payload / raw parameter (in the body)
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
        // if any, get the data and decode it into buffer
        req.on('data', function(data){
            buffer += decoder.write(data);
        });

        // when request has finished, (don't mind, this step always called)
        req.on('end', function(){
            buffer += decoder.end();
            
        // now we have to go to the address according the url/path
        var chosenHandler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : handlers.notFound;
        // >> process to lib/handlers.js

        // this is the data that we bring to the address
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };
        
        // sending the data to the address
        // Route the request to the handler specified in the router
        try{
            chosenHandler(data,function(statusCode,payload,contentType){
            server.processHandlerResponse(res,method,trimmedPath,statusCode,payload,contentType);

            });
        }catch(e){
            debug(e);
            server.processHandlerResponse(res,method,trimmedPath,500,{'Error' : 'An unknown error has occured'},'json');
        }
    })
}

server.processHandlerResponse = function(res,method,trimmedPath,statusCode,payload,contentType){
    // checking is statusCode a number?
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
    // checking is payload an object?
    payload = typeof(payload) == 'object' ? payload : {};
    // convert the payload
    var payloadString = JSON.stringify(payload);

    // Response / when request was catched, do or print this in the output:
    res.setHeader('Content-Type','application/json') // change object to JSON
    res.writeHead(statusCode); // not very important
    // this the primary output
    res.end(payloadString);

}

server.init = function(){

    // Running server on the specific port
    server.httpServer.listen(config.HttpPort, function() {
        console.log("Server has been started on port "+ config.HttpPort +" in " +config.envName+ " mode");
    })


    server.httpsServer.listen(config.HttpsPort, function(){
        console.log("HTTPS Server has been started on port "+ config.HttpsPort +" in " +config.envName+ " mode");
    })
}

module.exports = server;