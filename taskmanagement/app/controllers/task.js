var mongoose=require('mongoose');
var express=require('express');
var taskRouter=express.Router();
var taskModel=mongoose.model('task');
var responseGenerator=require('./../../libs/responseGenerator');
var util=require('./../../middleWares/utils');
var startDate=require('./../../middleWares/createdDate');
var finishDate=require('./../../middleWares/finishedDate')


module.exports.controllerFunction=function(app){
	//Api to create a task
	taskRouter.post('/createTask',util.generateRandomNumber,function(req,res){
		var newTask=new taskModel({
			id:"task_"+req.suffix_id,
			taskName:req.body.taskName,
			description:req.body.description,
			taskEndDate:req.body.taskEndDate,
			created_by:req.body.created_by.split(',')
		});

		newTask.save(function(err){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(newTask);
			}
		});
		
	});//Api to create a task ends here


	//Api to delete a particular task
	taskRouter.delete('/:id/deleteTask',function(req,res){
		taskModel.remove({'id':req.params.id},function(err,deletedProduct){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(deletedProduct);
			}
		})
	});//Api to delete a particular task ends here


	//Api to update a particular task
	taskRouter.put('/:id/updateTask',function(req,res){
		var update=req.body;
		taskModel.findOneAndUpdate({'id':req.params.id},update,{new:true},function(err,updatedTask){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(updatedTask);
			}
		})
	});//Api to update  a particular task ends here


	//Api to get all tasks
	taskRouter.get('/allTask',function(req,res){
		taskModel.find({},function(err,foundAllTask){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(foundAllTask);
			}
		});
	});//Api to get all tasks ends here

	
	taskRouter.get('/allTask/finishDate',startDate.createdDateFilter,function(req,res){
		taskModel.find({
			"created_on":{"$gte":req.nextDateTime}},function(err,result){
				if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
				}
				else{
					res.send(result);
				}
			});

	});


	taskRouter.get('/allTask/endDate',finishDate.endDateFilter,function(req,res){
		taskModel.find({
			"taskEndDate":{"$lt":req.previousDateTime}},function(err,result){
				if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
				}
				else{
					res.send(result);
				}
			});

	});


	taskRouter.get('/allTask/:name',function(req,res){
		taskModel.find({"created_by":req.params.name},function(err,result){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
				}
				else{
					res.send(result);
				}
		})
	});



	app.use(taskRouter);

}