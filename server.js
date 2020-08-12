let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
 
const server = new grpc.Server();
const SERVER_ADDRESS = "localhost:8080";
 
// Load protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("src/protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
let users = [];
 
// Receive message from client joining
function join(call, callback) {
  users.push(call);
  notifyChat({ user: "Server", text: "new user joined ..." });
}
 
// Receive message from client
function send(call, callback) {
  console.log(call.request);
  return callback(null,{text:call.request.text})
  //notifyChat(call.request);
}
 
// Send message to all connected clients
function notifyChat(message) {
  users.forEach(user => {
    user.write(message);
  });
}
 
// Define server with the methods and start it
server.addService(proto.example.Chat.service, { join: join, send: send });
 
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

console.log(1);
 
server.start();