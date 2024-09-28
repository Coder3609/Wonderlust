const joi=require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        image: joi.string().required(),
        location: joi.string().allow("",null),
        country: joi.string().required(),

    }). required()
})