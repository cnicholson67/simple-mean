var http = require("http"),
    mime = require('mime'),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    Users = require('./UserData.js');
 var port = process.argv[2] || 8888;
 var server =  http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
    if (fs.statSync(filename).isDirectory()) {filename += '/index.html';}
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
      response.writeHead(200, {"Content-Type": mime.lookup(filename)});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));
 var users = [];
 var io = require('socket.io')(server);
 io.on('connection', function (socket) {
     console.log(socket.id);
     socket.on('register', function (userdata) {
         Users.addNewAccount(userdata, function (err) {
             if (err) {
                 socket.emit('Regfail', { "message": err });
             } else {
                 socket.emit('RegistrationResult', userdata);
             }
         });
     });
     socket.on('authenticate', function (userdata) {
         Users.manualLogin(userdata.UserName, userdata.UserPass, function (err,user) {
             if (err) {
                 socket.emit('Authfail', { "message": err });
             } else {
                 socket.emit('Autheticated', user);
             }
         });
     });
     socket.on('disconnect', function () {

     });
 });
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");