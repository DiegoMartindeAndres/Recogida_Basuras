require('dotenv').config();
const mqtt = require('mqtt')

const host = process.env.HOST
const port = process.env.PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const lat_etsit = '40.4523805'
const lng_etsit = '-3.7262121'

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'end-device-lora1@ttn',
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

  if (data.bytes[2] == 0){
    latitud = lat_etsit;
    longitud = lng_etsit;
  }
  var object = {
    'Nivel de Llenado Sensores' : data.bytes[0],    
    'Latitud': latitud,
    'Longitud' : longitud,      
    'Bateria' : data.bytes[1],
    'Fecha' : json.received_at
  }
  console.log(object);
  //Traza de prueba para comprobar que se asignan bien los datos
  //console.log(json.uplink_message.decoded_payload);
})
