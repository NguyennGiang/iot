const mqtt = require('mqtt');
const Device = require("../model/device");

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'tcp://broker.hivemq.com';
        this.subscribeTopic = "hust/iot/data";
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, { port: 1883 });
        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
            this.mqttClient.subscribe(this.subscribeTopic, (err) => {
                if (err) console.log(err);
            })
        });


        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });

        this.mqttClient.on('message', async (_subscribeTopic, payload) => {
            try {
                let jsonMessage = JSON.parse(payload.toString());
                console.log("jsonMessage: ", jsonMessage);

                let device = await Device.findOne({ embedId: jsonMessage.embedId });
                if (device) {
                    device.connectState = "ON";

                    device.stateHistory = (typeof device.stateHistory != 'undefined' && device.stateHistory instanceof Array) ? device.stateHistory : [];

                    device.stateHistory.push({
                        at: Date.now(),
                        temperature: jsonMessage.temperature,
                        humidity: jsonMessage.humidity,
                        co2: Math.floor(Math.random() * 20),
                        dust: Math.floor(Math.random() * 70)
                    })

                    await Device.findByIdAndUpdate(device._id, {
                        $set: device
                    })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    sendMessage(topic, message) {
        this.mqttClient.publish(topic, message);
    }
}

module.exports = MqttHandler;