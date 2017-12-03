var mongoose=require('mongoose');
var express=require('express');
var taskRouter=express.Router();
var taskModel=mongoose.model('task');
var responseGenerator=require('./../../libs/responseGenerator');
var util=require('./../../middleWares/utils');

module.exports.controllerFunction=function(app){
	//Api to create a task
	taskRouter.post('/createTask',util.generateRandomNumber,function(req,res){
		console.log("server req endDate",Date.parse(req.body.taskEndDate),req.body.taskEndDate)
		if (new Date(req.body.taskEndDate)<= Date.now()){
			var myResponse=responseGenerator.generate(true,"taskend date should be greater than or equal to start date",400,null);
			res.send(myResponse);	
		}
		else{
			var newTask=new taskModel({
				id:"task_"+req.suffix_id,
				taskName:req.body.taskName,
				description:req.body.description,
				taskEndDate:req.body.taskEndDate,
				created_by:req.body.created_by.split(',')
			});	

			newTask.save(function(err){
				if(err){
					var myResponse=responseGenerator.generate(true,err,400,null);
					res.send(myResponse);
				}
				else{
					var myResponse=responseGenerator.generate(false,"taskManagement successfully added!",200,newTask);
					res.send(myResponse);
				}
			});
		}
		
		
	});//Api to create a task ends here


	//Api to delete a particular task
	taskRouter.delete('/:id/deleteTask',function(req,res){
		taskModel.remove({'id':req.params.id},function(err,deletedProduct){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{
				var myResponse=responseGenerator.generate(false,"Task successfully deleted!",200,deletedProduct);
				res.send(myResponse);
			}
		})
	});//Api to delete a particular task ends here


	//Api to update a particular task
	taskRouter.put('/:id/updateTask',function(req,res){
		var update=req.body;
		console.log("server update",req.params.id)
		taskModel.findOneAndUpdate({'id':req.params.id},update,{'upsert':true,'new':true},function(err,updatedTask){
			if(err){
				var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
				res.send(myResponse);
			}
			else{

				updatedTask.updated_on=Date.now();
				updatedTask.save(function(err){
					if(err){
						var myResponse=responseGenerator.generate(true,"some error"+err,500,null);
						res.send(myResponse);
					}
					else{
						var myResponse=responseGenerator.generate(false,"updated successfully",200,updatedTask);
						res.send(myResponse);
					}
				});
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

	//API to List all task created after a given date
	taskRouter.get('/allTask/startDate',util.createdDateFilter,function(req,res){
		taskModel.find({
			"created_on":{"$gte":req.nextDateTime}},function(err,result){
				if(err){
					var myResponse=responseGenerator.generate(true,err,500,null);
					res.send(myResponse);
				}
				else{
					var myResponse=responseGenerator.generate(false,"successfully fetched all task with created date after a given date",200,result);
					res.send(myResponse);
				}
			});

	});//API to List all task created after a given date ends here

	//API to List all with task with end date before a given date
	taskRouter.get('/allTask/endDate',util.endDateFilter,function(req,res){
			taskModel.find({
			"taskEndDate":{"$lt":req.previousDateTime}},function(err,result){
				console.log("allTask endDate",result);
				if(err){
					var myResponse=responseGenerator.generate(true,err,500,null);
					res.send(myResponse);
				}
				else{
					var myResponse=responseGenerator.generate(false,"successfully fetched all task with end date before a given date",200,result);
					res.send(myResponse);
				}
			});

	});//API to List all with task with end date before a given date ends here

	//API to List all task created by a particular user
	taskRouter.get('/allTask/:name',function(req,res){
		taskModel.find({"created_by":req.params.name},function(err,result){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
			}
			else{
				var myResponse=responseGenerator.generate(false,"successfully fetched",200,result);
				res.send(myResponse);
			}
		})
	});//API to List all task created by a particular user ends here


	taskRouter.get('/allTask/:taskName/:description',function(req,res){
		taskModel.find({'taskName':req.params.taskName,'description':req.params.description},function(err,result){
			if(err){
				var myResponse=responseGenerator.generate(true,err,500,null);
				res.send(myResponse);
			}
			else{
				res.send(result);
			}
		});
	});


	app.use(taskRouter);

}