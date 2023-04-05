require('dotenv').config();
const mqtt = require('mqtt')
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const Controller = require('./controllers/controller')


//db
// const db = new PouchDB('asiot_data');
// const remoteCouch = 'http://localhost:5984/asiot_data';
// const mapMarkers = new Map();

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
// const client = mqtt.connect(connectUrl, {
//     clientId,
//     clean: true,
//     connectTimeout: 4000,
//     username: process.env.USER,
//     password: process.env.PASSWORD,
//     reconnectPeriod: 1000,
// })

// const topic = process.env.TOPIC
// client.on('connect', () => {
//     console.log('Connected')
//     client.subscribe([topic], () => {
//         console.log(`Subscribe to topic '${topic}'`)
//     })
//     //En cuanto se conecta a la db, pinta todos los markers almacenados.
//     let todosDocs = db.allDocs(function(err, docs) {
//         if (err) {
//            return console.log(err);
//         } else {
//            console.log (docs.rows);
//         }
//      });
//      var obj = JSON.parse(todosDocs);
//      //Para todos los elementos recuperados de la db, los pinta.
//      for (var x in obj){
//         if (obj.hasOwnProperty(x)){
//           // your code
//           var objectJs = JSON.parse(x);
//          //Llamar a la función pintarNuevo y recoger el objeto marker para luego meterlo en el mapa.
//          //var marker = ...;
//           mapMarkers.set(objectJs.id,marker);
//         }
//       }
    

// })
// client.on('message', (topic, payload) => {
//     const json = JSON.parse(payload.toString());
//     const data = (json.uplink_message.decoded_payload);

//     let latitud = 0;
//     let longitud = 0;
//     let name = '';

//     //if (data.bytes[2] == 0){
//       //latitud = lat_etsit;
//       //longitud = lng_etsit;
//       //name = 'ETSIT'
//     //}
  
//     //Nuevo objeto
//     //Falta terminar de recoger los valores. 
//     var object = {
//         'name' : name,
//         'level' : data.bytes[0],
//         'latitude': latitud,
//         'longitude' : longitud,
//         'battery' : data.bytes[1],
//         'date' : json.received_at
//       }




//     var objectJs = JSON.parse(object);

//     //Viejo objeto, si existe.
//     var objetoViejoJs;
//     try{
//          var objetoViejo = db.get(name);
//          objetoViejoJs = JSON.parse(objetoviejo);
//     }catch(error){
//         console.log(error);
//         var objetoViejo = {
//             'id' : -1
//           }
//         objetoViejoJs = JSON.parse(objetoViejo);
//     }
    
//     try{
//         if(objetoViejoJs.level = -1){
//             //Si el objeto no existe
//              db.put(object);
            
//         } else{
//             //Si el objeto existe
//              db.update(object)
//         }
//     } catch(error){
//         console.log(error);
//     }

//     if(!mapMarkers.has(objetoViejoJs.id)){
//         //Llamar a la función pintarNuevo y recoger el objeto marker para luego meterlo en el mapa.
//         //var marker = ...;
//         mapMarkers.set(objectJs.id,marker);
//     } else{
//         var marker =  mapMarkers.get(objectJs.id);
//         //Llamar a la función pintarExistente y recoger el objeto marker para luego meterlo en el mapa.
//         //marker = ...;
//         mapMarkers.set(objectJs.id,marker);
//     }
     
// })

// exports.sync = function() {
//     var opts = {live: true};
//     db.replicate.to(remoteCouch, opts, syncError);
//     db.replicate.from(remoteCouch, opts, syncError);
// }

// exports.syncError = function() {
//     console.log("There was a problem syncing");
// }

// module.exports = { db, remoteCouch }