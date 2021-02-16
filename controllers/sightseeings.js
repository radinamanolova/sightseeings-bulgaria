const Sightseeing = require('../models/sightseeing');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Sightseeing.find({
            $or: [
                { title: { $regex: new RegExp(regex, 'i') } },
                { region: { $regex: new RegExp(regex, 'i') } }
            ]
        }, function (err, allSightseeings) {
            if (err) {
                console.log(err);
            } else {
                if (allSightseeings.length < 1) {
                    noMatch = "Обектът не е намерен. Моля опитайте пак.";
                }
                res.render('sightseeings/index', { sightseeings: allSightseeings, noMatch: noMatch });
            }
        });
    } else {
        const sightseeings = await Sightseeing.find({}, function (err, allSightseeings) {
            if (err) {
                console.log(err);
            } else {
                res.render('sightseeings/index', { sightseeings: allSightseeings, noMatch: noMatch });
            }
        });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render('sightseeings/new', { pageName: 'sightseeings/new' });
};

module.exports.renderMapView = async (req, res) => {
    const sightseeings = await Sightseeing.find({});
    res.render('sightseeings/map', { sightseeings });
};

module.exports.createSightseeing = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.sightseeing.location,
        limit: 1
    }).send();
    const sightseeing = new Sightseeing(req.body.sightseeing);
    sightseeing.geometry = geoData.body.features[0].geometry;
    sightseeing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    sightseeing.author = req.user._id;
    await sightseeing.save();
    req.flash('success', 'Вие успешно добавихте нов обект!');
    res.redirect(`/sightseeings/${sightseeing._id}`);
};

module.exports.showSightseeing = async (req, res) => {
    const sightseeing = await Sightseeing.findById(req.params.id).populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'author'
        }
    }).populate('author').populate('visits');
    if (!sightseeing) {
        req.flash('error', 'Не можем да намерим този обект!!');
        return res.redirect('/sightseeings');
    }
    res.render('sightseeings/show', { sightseeing });
};

module.exports.renderVisitsView = (req, res) => {
    Sightseeing.findById(req.params.id, function (err, foundSightseeing) {
        if (err) {
            console.log(err);
            return res.redirect("/sightseeings");
        }
        var foundUserVisit = foundSightseeing.visits.some(function (visit) {
            return visit.equals(req.user._id);
        });
        if (foundUserVisit) {
            foundSightseeing.visits.pull(req.user._id);
        } else {
            foundSightseeing.visits.push(req.user);
        }
        foundSightseeing.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/sightseeings");
            }
            return res.redirect("/sightseeings/" + foundSightseeing._id);
        });
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const sightseeing = await Sightseeing.findById(id);
    if (!sightseeing) {
        req.flash('error', 'Не можем да намерим този обект!');
        return res.redirect('/sightseeings');
    }
    res.render('sightseeings/edit', { sightseeing });
};

module.exports.updateSightseeing = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.sightseeing.location,
        limit: 1
    }).send();
    const { id } = req.params;
    const sightseeing = await Sightseeing.findByIdAndUpdate(id, { ...req.body.sightseeing });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    sightseeing.geometry = geoData.body.features[0].geometry;
    sightseeing.images.push(...imgs);
    await sightseeing.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await sightseeing.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Вие успешно обновихте обекта!');
    res.redirect(`/sightseeings/${sightseeing._id}`);
};

module.exports.deleteSightseeing = async (req, res) => {
    const { id } = req.params;
    await Sightseeing.findByIdAndDelete(id);
    req.flash('success', 'Вие успешно изтрихте обекта!');
    res.redirect('/sightseeings');
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};