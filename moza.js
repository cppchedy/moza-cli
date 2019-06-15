const Net = require("net");
const chalk = require('chalk');
const figures = require('figures');


function handleSocket(remoteAddr, pdu, cmd, succMsg, errMsg) {
  const clientSock = new Net.Socket();

  clientSock.setKeepAlive(true);

  clientSock.connect(remoteAddr, function() {
    console.log(chalk.green(figures('✔︎')), chalk.green("Connection TCP établie avec le server"));
    clientSock.write(pdu);
  });

  // The client can also receive data from the server by reading from its socket.
  clientSock.on("data", function(chunk) {
    const str = chunk.toString();
    console.log();
    console.log('Data received from the server:');
    console.log(chalk.yellow(str));
    const tokens = str.split("\r\n");

    if (tokens[0] === `${cmd}_OK`) {
      console.log(chalk.green(figures('✔︎')), chalk.green(succMsg));
      if(tokens[0] == "CONTEXT_OK")
        console.log(chalk.blue(tokens[1]));
    } else if (tokens[0] === `${cmd}_ERR`) {
      console.log(chalk.red("Commande échoué"));
      console.log(errMsg);
      console.log(tokens[1]);
    } else {
      console.log(chalk.red(figures('×')), chalk.red("réponse incorrecte"));
    }
  });

  clientSock.on("end", function() {
    console.log(chalk.green(figures('✔︎')), chalk.green("Fin de la connection TCP "));
  });

  clientSock.on("error", function(err) {
    console.log(chalk.red("error "), err.message);
  });
}

function sendContextCMD(remoteAddr) {
  const msg =
    "MOZA v1.0\r\n" +
    "CONTEXT\r\n" +
    "LENGTH : 0\r\n" +
    "ARGS : 0\r\n" +
    "\r\n";

  handleSocket(remoteAddr, msg, "CONTEXT", "Contexte ajouté", "Le serveur n'a pas pu ajouter un contexte");
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

  handleSocket(remoteAddr, msg, "UPDATE", "mise à jour effectué", "Le serveur n'a pas pu mettre à jour le port :");
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

  handleSocket(remoteAddr, msg, "NEW", "l'entité a été ajouté", "Le serveur n'a pas pu ajouter l'entité :");
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

  handleSocket(remoteAddr, msg, "DELETE", "l'entité a été supprimé", "Le serveur n'a pas pu supprimé l'entité :");
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

  handleSocket(remoteAddr, msg, "JOIN", "le client a rejoind le groupe", "Le serveur n'a pas pu faire la jointure :");
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

  handleSocket(remoteAddr, msg, "LEAVE", "le client a quitté le groupe", "Le serveur n'a pas pu faire l'opération :");
}

function sendPushCMD(remoteAddr, id, entity, entityName, data) {
  const msg =
    "MOZA v1.0\r\n" +
    "PUSH\r\n" +
    `LENGTH : ${data.length}\r\n` +
    "ARGS : 3\r\n" +
    `Identity : ${id}\r\n` +
    `Entity : ${entity}\r\n` +
    `EntityName : ${entityName}\r\n` +
    "\r\n" +
    `${data}`;

  handleSocket(remoteAddr, msg, "PUSH", "Le message a été envoyé", "Le serveur n'a pas pu faire l'opération :");
}

module.exports = { sendContextCMD, sendUpdateCMD, sendNewCMD, sendDeleteCMD, sendJoinCMD, sendLeaveCMD, sendPushCMD };
