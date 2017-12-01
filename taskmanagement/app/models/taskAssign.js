const mongoose=require('mongoose');
var Schema=mongoose.Schema;

var taskSchema=new Schema({
	taskName:{type:String},
	taskEndDate:{type:Date,required:true},
	description:{type:String},
	created_on: {type: Date,default:Date.now()},
	updated_on:{type:Date},
	id:{type:String},
	created_by:[String]
});

taskSchema.pre('save',function(next){
	let currentDate=new Date();
	this.updated_on=currentDate;
	if(!this.created_on)
		this.created_on=currentDate
	next();
});

mongoose.model('task',taskSchema);
