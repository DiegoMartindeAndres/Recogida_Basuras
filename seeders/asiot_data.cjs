var PouchDB = require('pouchdb');

var db = new PouchDB('http://localhost:5984/asiot_data');

const data = [
    {
        _id: 'ETSIT',
        level: 254,
        latitude: 40.4523805,
        longitude: -3.7262121,
        battery: 254
    },
    {
        _id: 'Campus Sur',
        level: 254,
        latitude: 40.388895,
        longitude: -3.628677,
        battery: 254
    },
    {
        _id: 'UC3M',
        level: 254,
        latitude: 40.3355117,
        longitude: -3.7644233,
        battery: 254
    },
];

function seeds(data) {
    for (let i=0; i<data.length; i++){
        addOrUpdate(data[i])
        console.log("Añadido o actualizado dato", i);
    }
};

async function addOrUpdate(dato) {
    try{
        var doc = await db.get(dato._id);
        var data = {
            _id: doc._id,
            _rev: doc._rev,
            level: dato.level,
            latitude: dato.latitude,
            longitude: dato.longitude,
            battery: dato.battery,
            date: new Date()
        }
        await db.put(data);

    }catch(err){
        if (err.reason == 'missing') {
            var data = {
                _id: dato._id,
                level: dato.level,
                latitude: dato.latitude,
                longitude: dato.longitude,
                battery: dato.battery,
                date: new Date()
            }
            await db.put(data);
        } else {
            console.log(err);
        }
    }
}

seeds(data);