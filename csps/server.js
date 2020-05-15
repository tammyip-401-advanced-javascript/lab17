'use strict'

//create a pool of connected sockets and read incoming data from a single socket, broadcasting that information back to all connected sockets.

const net = require('net');
const server = net.createServer();

let socketPool = [];
let port = 3000;

server.listen(port, () => {
  console.log('Server is up and running on port', port);
});

const logger = (payload) => {
  let parsed = JSON.parse(payload.toString());

  for (let i = 0; i < socketPool.length; i++) {
    let socket = socketPool[i];
    socket.write(payload);
  }

  if (parsed.event === 'pickup') {
    const content = parsed.content;
    const keys = Object.keys(content);
    keys.forEach(key => {
      console.log(`- ${key}: ${content[key]}`);
    })
    // console.log('pickup');
    // console.log('- Time', new Date());
    // console.log(parsed.content.orderID);
    // console.log('- OrderID:', parsed.content.orderID);
    // console.log('- Customer:', parsed.content.customer);
    // console.log('- Address:', parsed.content.address);

  }
  if (parsed.event === 'in-transit') {
    console.log(`in-transit order ${parsed.content.orderID}`);
  }

  if (parsed.event === 'delivered') {
    console.log(`delivered order ${parsed.content.orderID}`);
  }
}

server.on('connection', (socket) => {
  socketPool.push(socket);

  socket.on('data', logger);

  // let vendor = socketPool[0];
  // let driver = socketPool[1];

  // send something to single socket

  // if (vendor) {
  //   vendor.write("you're number one!");
  // }
  // if (driver) {
  //   driver.write("you're number two!");
  // }
});
