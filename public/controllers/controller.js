const db = new PouchDB('asiot_data');
const remoteCouch = 'http://localhost:5984/asiot_data';

export const databaseChangeEvent = async () =>{
    //Este método es llamado cada vez que hay un cambio en la base de datos por el db.changes.
    try{
        var doc = await db.allDocs({include_docs: true, descending: true});
        var todos = doc.rows.map(row => row.doc);
        return todos;

    } catch(err){
        console.log(err)
    }
};

export { db, remoteCouch }
