var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var urlParser = require('url');
var request = require("http-request");
var utils = require("./utils");

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";

// var routes = {
//   '/': require('./request-handler').requestHandler
// };

var server = http.createServer(handler.handleRequest);

console.log("Listening on http://" + ip + ":" + port);

server.listen(port, ip);

// request.get('www.google.com', function(err, res) {
//   if (err) {
//     console.log(err);
//   }

//   console.log(res.code, res.headers, res.buffer.toString());
// });
//


