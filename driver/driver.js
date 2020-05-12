'use strict'

const net = require('net');
const socket = net.Socket();
const faker = require('faker');

socket.connect({ port: 3000, host: 'localhost' }, () => {
  console.log('Connected to TCP Socket Server!');
});

socket.on('data', (payload) => {
  let stringPayload = Buffer.from(payload).toString();
  let jsonPayload = {};

  try {
    jsonPayload = JSON.parse(stringPayload);
  } catch (e) {
    jsonPayload = {};
  }

  if (jsonPayload.event === 'pickup')
    setTimeout(() => {
      console.log(`picked up order ${jsonPayload.content.orderID}\n`);
      socket.write(JSON.stringify({ event: 'in-transit', content: jsonPayload.content, }));
    }, 1000);

  setTimeout(() => {
    console.log(`delivered order ${jsonPayload.content.orderID}\n`);
    socket.write(JSON.stringify({ event: 'delivered', content: jsonPayload.content, }));
  }, 3000);
});