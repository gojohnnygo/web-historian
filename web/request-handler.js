var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils');
var urlParser = require('url');
// require more modules/folders here!

var objectId = 1;
var messages = [];

var actions = {
  'GET': function(request, response){
    utils.sendResponse(response, {results: messages});
  },
  'POST': function(request, response){
    utils.collectData(request, function(message){
      message.objectId = ++objectId;
      messages.push(message);
      utils.sendResponse(response, {objectId: 1}, 201);
    });
  },
  'OPTIONS': function(request, response){
    utils.sendResponse(response);
  }
};

exports.handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var parts = urlParser.parse(request.url);

  if (request.method === "GET") {

    if (request.url === "/") {
      fs.readFile(archive.paths.siteAssets + "/index.html", function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    } else if (request.url.length > 1) {
      fs.readFile(archive.paths.archivedSites + request.url, function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    }
  } else if (request.method === "POST") {
    fs.writeFileSync(archive.paths.list, request._postData.url + "\n");

    fs.readFile(archive.paths.siteAssets + "/loading.html", function (err, data){
      response.writeHead(302, {'Content-Type': 'text/html','Content-Length':data.length});
      response.write(data);
      response.end();
    });
  } else {
    utils.sendResponse(response, "Not Found", 404);
  }

};
