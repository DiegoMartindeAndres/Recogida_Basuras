const Controller = require('../../controllers/controller')
const { db, remoteCouch } = require('../../controllers/controller')

db.changes({
    since: 'now',
    live: true
}).on('change', updateFront);

function updateFront() {
    //L
    Controller.changeEvent
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