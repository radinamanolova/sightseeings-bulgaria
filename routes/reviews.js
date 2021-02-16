const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(reviews.allReviews)
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.get('/new', isLoggedIn, reviews.newReviewForm);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
