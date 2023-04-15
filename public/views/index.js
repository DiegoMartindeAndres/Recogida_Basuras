import {db, remoteCouch, databaseChangeEvent} from '/controllers/controller.js'
const map = L.map('map').setView([40.45272, -3.72649], 13);
var markersLayer = new L.LayerGroup();

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Contenedores:</a>'
}).addTo(map);

const iconoVerde = L.icon({
    iconUrl: 'images/verde.png',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const iconoAmarillo = L.icon({
    iconUrl: 'images/amarillo.png',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const iconoRojo = L.icon({
    iconUrl: 'images/rojo.png',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

db.changes({
    since: 'now',
    live: true
}).on('change', redrawEvent);

async function redrawEvent() {
    try {
        var todos = await databaseChangeEvent()
    } catch(err){
        console.log(err)
    }
    markersLayer.clearLayers();

    todos.forEach((objectJs, i) => {
        console.log(objectJs)
        var markerValues = configurarMarkerValues(objectJs)
        pintarMarker(markerValues);
        pintarModal(markerValues, i);
    });

    markersLayer.addTo(map);
}

function configurarMarkerValues(objectJs){
    const battery = (objectJs.battery*100)/254
    const level = configurarLevel(objectJs.level)
    const icono = configurarIcon(battery, level)

    var markerValues = {
        "id": objectJs._id,
        "level": level,
        "longitude": objectJs.longitude,
        "latitude": objectJs.latitude,
        "battery": battery,
        "icon": icono
    }
    return markerValues
}

function configurarLevel(level) {
    var value = ""
    if(level == 254){
        value = "Lleno"
    } else if (level == 15) {
        value = "Mitad"
    } else {
        value = "Vacío"
    }
    return value
}

function configurarIcon(battery, level) {
    var icono = null
    if (battery <= 25 || level == "Lleno") {
        icono = iconoRojo
    } else if ((battery > 25 && battery <= 75) || level == "Mitad") {
        icono = iconoAmarillo
    } else {
        icono = iconoVerde
    }
    return icono
}

function pintarMarker(markerValues){
    //var marker = L.marker([objectJs.latitude, objectJs.longitude]).bindPopup(popup, {showOnMouseOver:true});
    var marker = L.marker([markerValues.latitude, markerValues.longitude],{icon: markerValues.icon});
    marker.bindPopup("<b>Ubicación:" + markerValues.id + " | "+ markerValues.battery +"%"+ "</b><br>" + markerValues.level).openPopup();
    markersLayer.addLayer(marker);
}

function pintarModal(markerValues, i){
    const modal = document.getElementById("modal");
    const old_element = document.getElementById("element_" + i);

    if (old_element != null) {
        old_element.remove();
    }

    var element = document.createElement('div');
    element.setAttribute('id', 'element_' + i);
    element.classList.add("col-4", "border" , "border-primary");
    element.innerHTML =
        '<div class="row">' +
            '<div class="col" style="font-weight: bold">' + markerValues.id + '</div>' +
            '<div class="w-100 mb-1"></div>' +
            '<div class="col mb-1">' + markerValues.level + '</div>' +
            '<div class="col mb-1">' + 'Batería: ' + markerValues.battery + '%</div>' +
            '<div class="w-100"></div>' +
            '<div class="col">' + 'Longitud: ' + markerValues.longitude + '</div>' +
            '<div class="col">' + 'Latitud: ' + markerValues.latitude + '</div>' +
        '</div>';

    modal.appendChild(element);
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
    redrawEvent();

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
    console.log("There was an error syncing")
}