// libs
const { createServer } = require('net');
const { networkInterfaces } = require('os');

class ChatRoom {
  /**
   * @constructor
   */
  constructor(){
    this.chat = createServer();
    this.sockets = {};
    this.counter = 0;
    this.chat.on('connection', (socket) => this.newUser(socket));
  }

  /**
   * Method to get the server's local ip address
   */
  getLocalIp() {
    return Object.values(networkInterfaces())
      .flat()
      .find((device) => !device.internal && device.family === 'IPv4')
      .address;
  }

  /**
   * Method to write a message to everyone connected to the chat
   * @param { Socket } socket 
   * @param { String } message 
   * @param { String } data 
   */
  writeMessage(socket, message, data = null) {
    Object.entries(this.sockets).forEach(([, cs]) => {
      if (cs.id != socket.id) {
        if(!!data) {
          message += data;
        } else {
          message += '\n';
        }
        cs.write(message);
      }
    });
  };

  /**
   * Method to start the chat
   */
  start() {
    this.chat.listen(7500, () => console.log(`Chat listening on ${this.getLocalIp()}:7500`));
  }

  /**
   * Method to get current number of users connected to the chat
   */
  numOfUsers() {
    return Object.entries(this.sockets).length;
  }

  /**
   * Method to handle the connection of a new user to the chat
   * @param { Socket } socket 
   */
  newUser(socket) {
    console.log('Client connected');
    // Set the socket id
    socket.id = this.counter++;
    // Prompt the user to enter a username upon first connection
    socket.write(`Please enter a username: \n`);
    // Listen for data coming from the user
    socket.on('data', (data) => this.chatMessage(data, socket));
    // Listen for a disconnect
    socket.on('end', () => this.disconnect(socket));
  }

  /**
   * Method to handle the disconnection of a user
   * @param { Socket } socket 
   */
  disconnect(socket) {
      // Write a message to everyone in the chat
      this.writeMessage(socket, `User: ${socket.name}, has left the chat`);
      // Remove the user from the chat
      delete this.sockets[socket.id];
      // Log
      console.log('Client disconnected');
  }

  /**
   * Method to handle chat messages being sent
   * @param { Buffer } data 
   * @param { Socket } socket 
   */
  chatMessage(data, socket) {
    // New user
    if (!this.sockets[socket.id]) {
      // Grab username
      socket.name = data.toString().trim();
      // Store the new user
      this.sockets[socket.id] = socket;
      // Welcome message
      socket.write(`Hello! ${socket.name} \n`);
      socket.write(`Welcome to the chat room!\n`);
      socket.write(`There are currently ${this.numOfUsers() - 1} other people in the chat \n`);
      // Alert fellow users
      this.writeMessage(socket, `${socket.name} has a joined the chat!`);
      return;
    }
    // Not a new user, send the chat message to everyone
    this.writeMessage(socket, `${socket.name}: `, data);
  }
}

if(require.main === module) {
  new ChatRoom().start();
} else {
  module.exports = ChatRoom;
}
