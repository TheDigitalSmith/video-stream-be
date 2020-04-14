const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name:{ type: String,
        minlength: 5,
        maxlength:50, 
        required: true},
    phone:{ type: String,
        minlength:5,
        maxlength:50,
        required:true}
})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer){
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    })
    return Joi.validate(customer, schema);
}
module.exports= {Customer,
validate: validateCustomer};