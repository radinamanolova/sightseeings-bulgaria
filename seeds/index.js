const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sightseeing-bulgaria-v3';
const Sightseeing = require('../models/sightseeing');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModifyL: false
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