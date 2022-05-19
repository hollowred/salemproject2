const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema ({
    name: {type: String, required:true},
    species: {type: String, required:true},
    img: String,
    description: {type: String, required:true},

})

const Gallery = mongoose.model('Gallery', gallerySchema)
module.exports= Gallery
