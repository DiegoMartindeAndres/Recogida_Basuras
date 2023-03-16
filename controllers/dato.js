const Dato = require('../models/dato');


exports.list = async function() {
    let result = await Dato.find();    
    return result;
}

exports.create = async function(body) {
    let nuevo = new Dato(body);
    let result = await nuevo.save();

    console.log("--Dato creado--");
    return result;
}

exports.update = async function(body) {
    let result = await Dato.findByIdAndUpdate({_id: body._id}, body, {upsert: true})

    console.log("--Dato actualizado--");
    return result
}
