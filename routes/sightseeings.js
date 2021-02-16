const express = require('express');
const router = express.Router();
const sightseeings = require('../controllers/sightseeings');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateSightseeing } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(sightseeings.index))
    .post(isLoggedIn, upload.array('image'), validateSightseeing, catchAsync(sightseeings.createSightseeing));

router.get('/new', isLoggedIn, sightseeings.renderNewForm);

router.get('/map', sightseeings.renderMapView);

router.route('/:id')
    .get(catchAsync(sightseeings.showSightseeing))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSightseeing, catchAsync(sightseeings.updateSightseeing))
    .delete(isLoggedIn, isAuthor, catchAsync(sightseeings.deleteSightseeing));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(sightseeings.renderEditForm));

router.post('/:id/visit', isLoggedIn, sightseeings.renderVisitsView);

module.exports = router;