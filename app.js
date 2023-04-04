require('dotenv').config();
const mqtt = require('mqtt')
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

//Web
const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//MQTT
const host = process.env.HOST
const port = process.env.PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const lat_etsit = 40.4523805
const lng_etsit = -3.7262121
const connectUrl = `mqtt://${host}:${port}`

//Inicio del servidor web
app.get('/', (req, res, next) => {
	res.redirect('/dato');
})

app.get('/dato', async (req, res, next) => {
    //let datos = await DatoController.list().catch(e => next(e));
    res.render('index');
});

// handle 404 errors
app.use(function(req, res){
    res.status(404).render('notFound');
});

app.use(function(err, req, res, next) {
    console.log(err)
    res.status(500).render('error', { error: err});
});

const portWeb = parseInt('8001', 10);
app.listen(portWeb, function() {
    console.log('App listening on port: ' + 8001);
});

//Conexión MQTT
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

    let latitud = 0;
    let longitud = 0;
    let name = '';

    if (data.bytes[2] == 0){
      latitud = lat_etsit;
      longitud = lng_etsit;
      name = 'ETSIT'
    }

    var object = {
      'name' : name,
      'level' : data.bytes[0],
      'latitude': latitud,
      'longitude' : longitud,
      'battery' : data.bytes[1],
      'date' : json.received_at
    }

    DatoController.update(object)
})
