const mqtt = require('mqtt')

const host = 'eu1.cloud.thethings.network'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'end-device-lora1@ttn',
  password: 'NNSXS.2H3DTCOG63JQ6P326ETHINRIVNSBES2QJTUQPGY.EUBQWRC4N7Q7JNRHFCDLMBQYCJZWH22U3DSP5PL2DKNV6MITRTEQ',
  reconnectPeriod: 1000,
})

const topic = 'v3/end-device-lora1@ttn/devices/eui-0080e1150500d661/up'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })  
})
client.on('message', (topic, payload) => {
  const json = JSON.parse(payload.toString());
  const data = (json.uplink_message.decoded_payload);

  var object = {
    'Nivel de Llenado Sensores' : data.bytes[0],
    'Flag Latitud' : data.bytes[2],
    'Valores Latitud' : [data.bytes[3], data.bytes[4], data.bytes[5]],
    'Flag Longitud' : data.bytes[6],
    'Valores Longitud' : [data.bytes[7], data.bytes[8], data.bytes[9]],  
    'Bateria' : data.bytes[1],
  }
  console.log(object);
  //Traza de prueba para comprobar que se asignan bien los datos
  console.log(json.uplink_message.decoded_payload);
})
