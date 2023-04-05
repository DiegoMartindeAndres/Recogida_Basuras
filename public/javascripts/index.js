//const Controller = require( "../../controllers/controller");

//const { db, remoteCouch } = require('../../controllers/controller')


const map = L.map('map').setView([40.45272, -3.72649], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Contenedores:</a>'
}).addTo(map);


db.changes({
    since: 'now',
    live: true
}).on('change', updateFront(change));

function updateFront(object) {
     var objectJs = JSON.parse(object);

//     //Viejo objeto, si existe.
     var objetoViejoJs;
     try{
         var objetoViejo = db.get(objectJs.name);
          objetoViejoJs = JSON.parse(objetoViejo);
     }catch(error){
         console.log(error);
         var objetoViejo = {
             'name' : -1
           }
         objetoViejoJs = JSON.parse(objetoViejo);
     }
    
    try{
        if(objetoViejoJs.name == -1){
             //Si el objeto no existe
             Controller.
              putDB(object);
            
         } else{
             //Si el objeto existe
             updateDB(object)
         }
     } catch(error){
        console.log(error);
     }

    if(!mapMarkers.has(objetoViejoJs.id)){
        var marker = L.marker([objectJs.latitude, objectJs.longitude]).addTo(map);
        marker.bindPopup("<b>Ubicación:" + objectJs.name + " | "+ objectJs.battery +"%"+ "</b><br>Nivel de llenado:"+objectJs.level).openPopup();

     } else{
         var marker =  mapMarkers.get(objectJs.id);
         marker.bindPopup("<b>Ubicación:" + objectJs.name + " | "+ objectJs.battery +"%"+ "</b><br>Nivel de llenado:"+objectJs.level).update();

     }
    Controller.changeEvent
}

function inicializarFront(object){
    var objectJs = JSON.parse(object);
    var marker = L.marker([objectJs.latitude, objectJs.longitude]).addTo(map);
    marker.bindPopup("<b>Ubicación:" + objectJs.name + " | "+ objectJs.battery +"%"+ "</b><br>Nivel de llenado:"+objectJs.level).openPopup();
}

//Manejadores de eventos
function addEventListeners() {
    window.addEventListener("offline", (event) => {
        console.log("OFFLINE");
        Controller.syncError();
    });

    window.addEventListener("online", (event) => {
        console.log("ONLINE");
        Controller.sync()
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    addEventListeners();
    Controller.changeEvent();

    if (remoteCouch){
        sync();
    }
});