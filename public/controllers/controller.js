//const PouchDB = require('pouchdb');
const db = new PouchDB('asiot_data');
const remoteCouch = 'http://localhost:5984/asiot_data';
const map = L.map('map').setView([40.45272, -3.72649], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Contenedores:</a>'
}).addTo(map);

db.changes({
    since: 'now',
    live: true}).on('change',databaseChangeEvent);
    
async function databaseChangeEvent(){
    //Si ha sucedido algo en la base de datos, repinta todo.
    //Este método es llamado cada vez que hay un cambio en la base de datos por el db.changes.
    try{
        var doc = await db.allDocs({include_docs: true, descending: true});
        var todos = doc.rows.map(row => row.doc);
        console.log("todos");
        var todosJs = JSON.parse(todos); 
        //Borro los markers
        var markers = L.markerClusterGroup();
        markers.clearLayers();

        for (var x in todosJs){
            console.log("Marker: "+x);
            if (todosJs.hasOwnProperty(x)){
                pintarMarker(x);
            }
        }
        console.log(todos)
    } catch(err){
        console.log(err)
    }
}



function pintarMarker(object){
    var objectJs = JSON.parse(object);
    var marker = L.marker([objectJs.latitude, objectJs.longitude]).addTo(map);
    marker.bindPopup("<b>Ubicación:" + objectJs.name + " | "+ objectJs.battery +"%"+ "</b><br>Nivel de llenado:"+objectJs.level).openPopup();
}

//Manejadores de eventos
function addEventListeners() {
    window.addEventListener("offline", (event) => {
        console.log("OFFLINE");
        syncError();
    });

    window.addEventListener("online", (event) => {
        console.log("ONLINE");
        sync()
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    addEventListeners();
    //changeEvent();

    if (remoteCouch){
        sync();
    }
});
function sync () {

    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

function syncError(){

}

//module.exports = { db, remoteCouch }