import { db, remoteCouch} from "./controllers/controller.js";

require('dotenv').config();
const mqtt = require('mqtt')
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

let objArray = [];
let indiceObj = 0;

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

const map = L.map('map').setView([40.45272, -3.72649], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Contenedores:</a>'
}).addTo(map);

      

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
    //En cuanto se conecta a la db, pinta todos los markers almacenados.
    let todosDocs = await db.allDocs
    

})
client.on('message', (topic, payload) => {
    const json = JSON.parse(payload.toString());
    const data = (json.uplink_message.decoded_payload);

    let latitud = 0;
    let longitud = 0;
    let name = '';

    //if (data.bytes[2] == 0){
      //latitud = lat_etsit;
      //longitud = lng_etsit;
      //name = 'ETSIT'
    //}
  
    //Nuevo objeto
    var object = {
        'name' : name,
        'level' : data.bytes[0],
        'latitude': latitud,
        'longitude' : longitud,
        'battery' : data.bytes[1],
        'date' : json.received_at
      }

    var objectJs = JSON.parse(object);

    //Viejo objeto, si existe.
    var objetoViejoJs;
    try{
         var objetoViejo = await db.get(name);
         objetoViejoJs = JSON.parse(objetoviejo);
    }catch(error){
        console.log(error);
        var objetoViejo = {
            'level' : -1
          }
        objetoViejoJs = JSON.parse(objetoViejo);
    }
    
    try{
        if(objetoViejoJs.level = -1){
            //Si el objeto no existe
            await db.put(object);
            
        } else{
            //Si el objeto existe
            await db.update(object)
        }
    } catch(error){
        console.log(error);
    }
    //Actualizo el mapa.   - MODIFICAR

      //Gestiono las copias guardadas en la base de datos.
      let encontrado = false;
      let indice = 0;
      //Extrago el valor del indice.
      while (objetoViejoJs.level != -1 && !encontrado && indice < indiceObj){
        if(objArray[indice].id == objetoJs.id){
            encontrado = true;
        } else{
            indice ++;
        }
      }
      //Si no existe, indice = -1. Si existe, el valor del índice es el índice donde se encuentra el marker en el array.
      if(!encontrado){
        //Ajusto las variables
        indice = -1;
        var marker = L.marker([objectJs.latitude, objectJs.longitude]).addTo(map);
        marker.bindPopup("<b>Ubicación:" + objectJs.name + "</b><br>Nivel de llenado:"+objectJs.level"<br>Bateria:"+objectJs.battery).openPopup();
        markerArray[indiceMarkerArray] = marker;
        indiceMarkerArray++;
       
      } else{
        //Si existe, entonces actualizo el mapa con el nuevo valor de llenado.
        var marker = markerArray[indice]; //MAL
        //Actualizo
        marker.bindPopup("<b>Ubicación:" + objectJs.name + "</b><br>Nivel de llenado:"+objectJs.level"<br>Bateria:"+objectJs.battery).update();

        //Reintroduzco en el array
        markerArray[indice] = marker;
      }



     
})
