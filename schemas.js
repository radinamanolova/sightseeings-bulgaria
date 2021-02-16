const { sanitize } = require('express-mongo-sanitize');
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.sightseeingSchema = Joi.object({
    sightseeing: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        region: Joi.string().required().escapeHTML(),
        moreInfo: Joi.string().required().escapeHTML(),
        workingDayStart: Joi.string().required().escapeHTML(),
        workingDayEnd: Joi.string().required().escapeHTML(),
        workingHourStart: Joi.number().required().min(0).max(24),
        workingHourEnd: Joi.number().required().min(0).max(24)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});