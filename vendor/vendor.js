'use strict';

//Every 5 seconds, a new customer order will be randomly generated. This order should have a store name, order id, customer name and address. 

//When a new customer order is generated, create an object with key values event set to pickup and payload set to the customer order object.

//Send this {event, payload} object to the CSPS Socket Server

//Listen for the data event from the CSPS Socket Server. When you hear that event, look at the payload sent and parse it. If it has property event equal to delivered, then you should log a thank you message to the console. Ignore all other events.

const net = require('net');
const socket = new net.Socket();
const faker = require('faker');

socket.connect({ port: 3000, host: 'localhost' }, () => {
  console.log('Connected to TCP Socket Server!');
});

setInterval(() => {
  const order = {
    time: faker.date.recent(),
    store: 'My Flower Shop',
    orderID: faker.random.number(),
    customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`,
  };
  socket.write(JSON.stringify({ event: 'pickup', content: order }));
}, 5000);

socket.on('data', (payload) => {
  let stringPayload = Buffer.from(payload).toString();
  let jsonPayload = {};

  // let parsed = JSON.parse(payload.toString());

  // if (parsed.event === 'delivered'){
  //   console.log('thank you');
  // }

  try {
    jsonPayload = JSON.parse(stringPayload);
  } catch (e) {
    jsonPayload = {};
  }

  if (jsonPayload.event === 'delivered') {
    console.log(`Thank you for delivering order ${jsonPayload.content.orderID}\n`);
  }
});