//const PouchDB = require('pouchdb');
const db = new PouchDB('asiot_data');
const remoteCouch = 'http://localhost:5984/asiot_data';
const map = L.map('map').setView([40.45272, -3.72649], 13);
var markersLayer = new L.LayerGroup();

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
        
       
        //Borro los markers
        markersLayer.clearLayers();

        todos.forEach((element, i) => {
            console.log(JSON.stringify(element))
            var objectJs = JSON.parse(JSON.stringify(element));
            console.log(objectJs)
            pintarMarker(objectJs);
        });

        
        markersLayer.addTo(map);
        
    } catch(err){
        console.log(err)
    }
}



function pintarMarker(objectJs){
    console.log(objectJs)
    //var marker = L.marker([objectJs.latitude, objectJs.longitude]).bindPopup(popup, {showOnMouseOver:true});
    var marker = L.marker([objectJs.latitude, objectJs.longitude]);
    marker.bindPopup("<b>Ubicación:" + objectJs._id + " | "+ objectJs.battery +"%"+ "</b><br>Nivel de llenado:"+objectJs.level).openPopup();
    markersLayer.addLayer(marker);
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
    databaseChangeEvent();

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
