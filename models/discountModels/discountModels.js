const mongoose = require('mongoose'); 

var discountModels = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    discountNumber:{
        type:Number,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
});

module.exports = mongoose.model('Discount', discountModels);