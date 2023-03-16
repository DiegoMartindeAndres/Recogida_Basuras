'use strict'
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const DatoSchema = Schema({
    _id: Number,
    level: Number,
    latitude: Number,
    longitude: Number, 
    battery: Number,
    date: Date
});

module.exports = mongoose.model('Dato', DatoSchema);
