require('dotenv').config();
const mqtt = require('mqtt')
const DatoController = require('./controllers/dato')

const host = process.env.HOST
const port = process.env.PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const lat_etsit = 40.4523805
const lng_etsit = -3.7262121

const mongoose = require('mongoose');
(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/asiot_data',{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Connected to Mongo!')        
    } catch (err) {
        console.log('Error connecting to Database: ' + err)
    }
})()

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.USER,
  password: process.env.PASSWORD,
  reconnectPeriod: 1000,
})

const topic = process.env.TOPIC
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})
client.on('message', (topic, payload) => {
  const json = JSON.parse(payload.toString());
  const data = (json.uplink_message.decoded_payload);

  latitud = 0;
  longitud = 0;
  id = 0;

  if (data.bytes[2] == 0){
    id = 1;
    latitud = lat_etsit;
    longitud = lng_etsit;
  }
  var object = {
    '_id' : id,
    'level' : data.bytes[0],
    'latitude': latitud,
    'longitude' : longitud,
    'battery' : data.bytes[1],
    'date' : json.received_at
  }

  DatoController.update(object)
})
