var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ProfileSchema=new Schema({
    user_id:{
      type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:'user id is required'
    },
    name:{
        type:String,
        required:'name is required'
    },
    city:{
        type:String
    }

});

module.exports=mongoose.model('Profile',ProfileSchema);