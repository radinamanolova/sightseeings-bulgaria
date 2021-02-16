const mongoose = require('mongoose');
const Sightseeing = require('../models/sightseeing');

mongoose.connect('mongodb://localhost:27017/sightseeing-bulgaria-v3', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Sightseeing.deleteMany({});
    // await Sightseeing.save();
};

seedDB().then(() => {
    mongoose.connection.close();
});