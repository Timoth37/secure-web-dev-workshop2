require('dotenv').config()
const mongoose =require('mongoose');
const { Schema } = mongoose;
const filmingLocationsSchema = new Schema({
    filmType:  String,
    filmProducerName: String,
    endDate: Date,
    filmName: String,
    district: String,
    geolocation: {
        coordinates: {
            type: [Number]
        },
        type: {
            type: String,
            enum: ['Point'],
        }
    },
    sourceLocationId : String,
    filmDirectorName: String,
    address: String,
    startDate: Date,
    year: Number
});
const Location = mongoose.model('Location', filmingLocationsSchema);



async function main (){
    const result = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected with success");
    //await loadLocations();
    //console.log("Loading all elements to the database...");
    await deleteByID('63405b53586239aabf08bbdd');
    await locationByID('63405b53586239aabf08bbe1');
    await locationsByName('IBRAHIM');
    const instance = new Location({filmType : "film",
        filmProducerName : "Dupond",
        endDate: new Date("10-12-2022"),
        filmName: "Top Gun",
        district: "75002",
        geolocation: [12.00000,13.00000],
        sourceLocationId : "1565656",
        filmDirectorName: "Durant",
        address: "4 place du petit bois",
        startDate: new Date("10-10-1997"),
        year: parseInt("1997")})
    addLocation(instance);
    await locationsByName("Top Gun");
    const update = {$set: {filmProducerName: "Mr Dupond"}};
    updateLocation("634d779fa54b81414651b7e5", update);
    await locationsByName("Top Gun");


}

async function loadLocations () {
    for(let pas =0; pas<filmingLocations.length; pas++)
    {
        const instance = new Location({filmType : filmingLocations[pas].fields.type_tournage,
            filmProducerName : filmingLocations[pas].fields.nom_producteur,
            endDate: new Date(filmingLocations[pas].fields.date_fin),
            filmName: filmingLocations[pas].fields.nom_tournage,
            district: filmingLocations[pas].fields.ardt_lieu,
            geolocation: filmingLocations[pas].fields.geo_shape,
            sourceLocationId : filmingLocations[pas].fields.id_lieu,
            filmDirectorName: filmingLocations[pas].fields.nom_realisateur,
            address: filmingLocations[pas].fields.adresse_lieu,
            startDate: new Date(filmingLocations[pas].fields.date_debut),
            year: parseInt(filmingLocations[pas].fields.annee_tournage)})
        await instance.save()
    }
    console.log("End")
}

async function locationByID(idToFind){
    Location.findById(idToFind).then(film => console.log("Location by ID : ",film));
}

async function locationsByName(filmName){
    Location.find({filmName : filmName}).then(films => console.log("Locations by Name : ", films));
}

async function deleteByID(id){
    try{
        Location.findOneAndDelete( {_id : id}).then(console.log("Instance removed"));
    }catch(e){
        console.log("Instance not present or already deleted");
    }

}

function addLocation(location){
    try{
        location.save();
    }catch(e){
        console.log("Something crashed");
    }
}

function updateLocation(id, update){
    try {
        Location.updateOne({ id: id }, update).then(console.log("Instance updated"));
    } catch (e) {
        console.log("Something crashed");
    }
}
const filmingLocations = require('./lieux-de-tournage-a-paris.json')
main()
