const mongoose=require('mongoose');
var Schema=mongoose.Schema;

var taskSchema=new Schema({
	taskName:{type:String,required:true},
	taskEndDate:{type:Date,required:true},
	description:{type:String,required:true},
	created_on: {type: Date,default:Date.now()},
	updated_on:{type:Date,default:Date.now()},
	id:{type:String},
	created_by:{type:[String],required:true}
});
module.exports =mongoose.model('task',taskSchema);
