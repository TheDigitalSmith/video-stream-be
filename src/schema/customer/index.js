const mongoose = require('mongoose');

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

module.exports= Customer;