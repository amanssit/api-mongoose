var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    sku: {
        type: String,
        unique: true,
        required:'sku is required'
    },
    user_id:{
      type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:'user_id is required'
    },
    name: {
        type: String,
        required:'name is required'
    },
    price: {
        type: Number,
        required:'price is required'
    },
    quantity: {
        type: Number,
        required:'quantity is required'
    },
    status:{
        type:Boolean,
        required:'status is required'
    },
    is_deleted:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('Product', ProductSchema);