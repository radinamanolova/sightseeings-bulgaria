const Sightseeing = require('../models/sightseeing');
const Review = require('../models/review');

module.exports.allReviews = (req, res) => {
    Sightseeing.findById(req.params.id).populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'author'
        }
    }).exec(function (err, sightseeing) {
        if (err || !sightseeing) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render('reviews/index', { sightseeing: sightseeing });
    });
};

module.exports.newReviewForm = (req, res) => {
    Sightseeing.findById(req.params.id, function (err, sightseeing) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("reviews/new", { sightseeing: sightseeing });
    });
};

module.exports.createReview = async (req, res) => {
    const sightseeing = await Sightseeing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.created = new Date();
    sightseeing.reviews.push(review);
    await review.save();
    await sightseeing.save();
    req.flash('success', 'Вие успешно добавихте ревю!');
    res.redirect(`/sightseeings/${sightseeing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Sightseeing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Вие успешно изтрихте ревю!');
    res.redirect(`/sightseeings/${id}`);
};