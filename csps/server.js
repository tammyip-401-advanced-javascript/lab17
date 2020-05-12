'use strict'

//create a pool of connected sockets and read incoming data from a single socket, broadcasting that information back to all connected sockets.

const net = require('net');
const server = net.createServer();

let socketPool = [];
let port = 3000;

server.listen(port, () => {
  console.log('Server is up and running on port', port);
});

server.on('connection', (socket) => {
  socketPool.push(socket);

  socket.on('data', (payload) => {
    console.log(JSON.parse(Buffer.from(payload).toString()));

    // send something to single socket

    let vendor = socketPool[0];
    let driver = socketPool[1];

    if (vendor) {
      vendor.write("you're number one!");
    }
    if (driver) {
      driver.write("you're number two!");
    }
  });
});