const Net = require("net");

function handleSocket(remoteAddr, msg) {
  const clientSock = new Net.Socket();

  clientSock.setKeepAlive(true);

  clientSock.connect(remoteAddr, function() {
    console.log("TCP connection established with the server");
    clientSock.write(msg);
  });

  // The client can also receive data from the server by reading from its socket.
  clientSock.on("data", function(chunk) {
    const str = chunk.toString();
    console.log();
    console.log('Data received from the server:');
    console.log(str);
    const tokens = str.split("\r\n");

    if (tokens[0] === "CONTEXT_OK") {
      console.log("Contexte ajouté");
      console.log(tokens[1]);
    } else if (tokens[0] === "CONTEXT_ERR") {
      console.log("Commande échoué");
      console.log("Le serveur n'a pas pu ajouter un contexte");
    } else {
      console.log("réponse incorrecte");
    }
  });

  clientSock.on("end", function() {
    console.log("Requested an end to the TCP connection");
  });

  clientSock.on("error", function(err) {
    console.log("error ", err.message);
  });
}

function sendContextCMD(remoteAddr) {
  const msg =
    "MOZA v1.0\r\n" +
    "CONTEXT\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 0\r\n" +
    "\r\n";

  handleSocket(remoteAddr, msg);
}

function sendUpdateCMD(remoteAddr, id, listeningPort) {
  const msg =
    "MOZA v1.0\r\n" +
    "UPDATE\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 2\r\n" +
    `Identity : ${id}\r\n` +
    `Port : ${listeningPort}\r\n` +
    "\r\n";

  handleSocket(remoteAddr, msg);
}

function sendDiassociateCMD() {}

function sendNewCMD(remoteAddr, entity, entityName, groupType) {
  const msg =
    "MOZA v1.0\r\n" +
    "NEW\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 3\r\n" +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    `GroupType : ${groupType}\r\n`+
    "\r\n";

  handleSocket(remoteAddr, msg);
}

function sendDeleteCMD(remoteAddr, entity, entityName) {
  const msg =
    "MOZA v1.0\r\n" +
    "DELETE\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 2\r\n" +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    "\r\n";

  handleSocket(remoteAddr, msg);
}

function sendJoinCMD(remoteAddr, id, entity, entityName, membershipType, annotation) {
  const msg =
    "MOZA v1.0\r\n" +
    "JOIN\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 5\r\n" +
    `Identity : ${id}\r\n` +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    `MembershipType : ${membershipType}\r\n` +
    `Annotation : ${annotation}\r\n` +
    "\r\n";

  handleSocket(remoteAddr, msg);
}


function sendLeaveCMD(remoteAddr, id, entity, entityName, membershipType) {
  const msg =
    "MOZA v1.0\r\n" +
    "LEAVE\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 4\r\n" +
    `Identity : ${id}\r\n` +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    `MembershipType : ${membershipType}\r\n` +
    "\r\n";

  handleSocket(remoteAddr, msg);
}

function sendPushCMD(remoteAddr, entity, entityName, data) {
  const msg =
    "MOZA v1.0\r\n" +
    "LEAVE\r\n" +
    `LENGTH : ${data.length}\r\n` +
    "ARGS : 3\r\n" +
    `Identity : ${id}\r\n` +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    "\r\n" +
    `${data}`;

  handleSocket(remoteAddr, msg);
}

module.exports = { sendContextCMD, sendUpdateCMD, sendNewCMD, sendDeleteCMD, sendJoinCMD, sendLeaveCMD, sendPushCMD };
