const mongoose = require ('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email:{
        type: String,
        minlength: 5,
        maxlength:255,
        required:true,
        unique: true
    },
    password:{
        type: String,
        minlength:5,
        maxlength: 1024,
        required: true
    }
})

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return Joi.validate(user, schema)
}

module.exports = {
    User, validateUser
}