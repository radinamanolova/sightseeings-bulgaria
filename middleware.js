const { sightseeingSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Sightseeing = require('./models/sightseeing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Трябва да влезете първо в профила си!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const sightseeing = await Sightseeing.findById(id);
    if (!sightseeing.author.equals(req.user._id)) {
        req.flash('error', 'Нямате право да направите това.');
        return res.redirect(`/sightseeings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Нямате право да направите това.');
        return res.redirect(`/sightseeings/${id}`);
    }
    next();
};

module.exports.validateSightseeing = (req, res, next) => {
    const { error } = sightseeingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};