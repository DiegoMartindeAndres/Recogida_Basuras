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
  console.log(json.uplink_message.decoded_payload);

})
