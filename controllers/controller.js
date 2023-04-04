const PouchDB = require('pouchdb');

const db = new PouchDB('asiot_data');
const remoteCouch = 'http://localhost:5984/asiot_data';

exports.changeEvent = async function() {
    try{
        var doc = await db.allDocs({include_docs: true, descending: true});
        //console.log(doc);
        var todos = doc.rows.map(row => row.doc);
        console.log(todos)
        //redrawTodosUI(todos);
    } catch(err){
        console.log(err);
    }
}

exports.sync = function() {
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

exports.syncError = function() {
    console.log("There was a problem syncing");
}

module.exports = { db, remoteCouch }