const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const expressSession = require("express-session");
const Device = require('./app/model/device');
const User = require('./app/model/user');
let mqttClient = require('./app/mqttWrapper/mqttClient');

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./api.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)


const server = express().use(express.json()).use(express.urlencoded({ extended: true })).use(cors());

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



server.use(expressSession({ secret: "secret" }))
server.use(passport.initialize());
server.use(passport.session());
require("./passportConfig")(passport);

const userRouter = require('./app/router/userRouter');
const deviceRouter = require('./app/router/deviceRouter');
const user = require('./app/model/user');

server.use('/users', userRouter);
server.use('/devices', deviceRouter);
server.use(express.static('public'));

//connect db mongo atlas
const uri = 'mongodb+srv://iot:iot@iot-hust-2022.l4h0bw8.mongodb.net/';
const connect = mongoose.connect(uri, { dbName: 'IOT', useNewUrlParser: true, useUnifiedTopology: true });
connect.then(() => {
    console.log("Connected to the database.");
}, (err) => {
    console.log(err);
});


const http = require('http').createServer(server);

http.mqttClient = mqttClient;
http.listen(2411);

console.log("Listen at port 2411");