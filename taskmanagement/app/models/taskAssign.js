const mongoose=require('mongoose');
var Schema=mongoose.Schema;

var taskSchema=new Schema({
	taskName:{type:String},
	taskEndDate:{type:Date,required:true},
	description:{type:String},
	created_on: {type: Date,default:Date.now()},
	updated_on:{type:Date,default:Date.now()},
	id:{type:String},
	created_by:[String]
});
mongoose.model('task',taskSchema);
