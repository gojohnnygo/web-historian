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

  var fixturePath = archive.paths.testdata;
  //read file in fixturePath, see if request.url exists in it. if so,
  //exists is true
  console.log('fixturePath: ', fixturePath);
  fs.readdirSync(fixturePath, function(error, files){
    console.log(files.indexOf("sites.txt"));
    console.log('exists:', exists);
  });

  // fs.existsSync(fixturePath, function(e) {
  //   exists = e;
  // });

  if (request.method === "GET") {

    if (request.url === "/") {
      fs.readFile(archive.paths.siteAssets + "/index.html", function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    } else if (exists) {
      fs.readFile(archive.paths.archivedSites + request.url, function (err, data) {
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    } else {
      response.writeHead(404, 'file not found');
      response.end();
    }
  }

  if (request.method === "POST") {
    fs.appendFile(archive.paths.list, request._postData.url + "\n", function() {
      fs.readFile(archive.paths.siteAssets + "/loading.html", function (err, data){
        response.writeHead(302, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
      });
    });
  } else {
    utils.sendResponse(response, "Not Found", 404);
  }

};
