const Net = require("net");
const {sendUpdateCMD} = require('./moza')

function initServer(remoteAddr, id, port) {
  const server = new Net.Server();
  // The server listens to a socket for a client to make a connection request.
  // Think of a socket as an end point.
  server.listen(port, function() {
    console.log(
      `Server listening for connection requests on socket localhost:${port}`
    );
    sendUpdateCMD(remoteAddr, id, port);
  });

  // When a client requests a connection with the server, the server creates a new
  // socket dedicated to that client.
  server.on("connection", function(socket) {
    console.log("------------remote client info --------------");

    var rport = socket.remotePort;
    var raddr = socket.remoteAddress;
    var rfamily = socket.remoteFamily;

    console.log("REMOTE Socket is listening at port" + rport);
    console.log("REMOTE Socket ip :" + raddr);
    console.log("REMOTE Socket is IP4/IP6 : " + rfamily);

    console.log("--------------------------------------------");
    socket.on("data", function(data) {
      var bread = socket.bytesRead;
      var bwrite = socket.bytesWritten;
      console.log("Bytes read : " + bread);
      console.log("Bytes written : " + bwrite);
      console.log("Data sent to server : " + data);
    });
  
    socket.on("end", function() {
      console.log("Closing connection with the client");
    });
  
    // Don't forget to catch error, for your own sake.
    socket.on("error", function(err) {
      console.log(`Error: ${err}`);
    });
  });
}

module.exports = { initServer }
