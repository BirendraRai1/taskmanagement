function generateRandomNumber(req,res,next){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 8; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	req.suffix_id=text;
	next();
}

function endDateFilter(req,res,next){
	if(req.query.endDate){
		var endDate=new Date(req.query.endDate);//for running on application take endDate from req.query.endDate 
	}
	else{
		var endDate=new Date(req.body.endDate);//for testing take endDate from req.body.endDate
	}
	if (isNaN(endDate)){
		res.send("Please provide a valid date in valid format");
	}
	req.previousDateTime  = endDate;
	next();
}

function createdDateFilter(req,res,next){
	if(req.query.createDate){
		var createdDate=new Date(req.query.createDate);//for running on application take createDate from req.query.endDate	
	}
	else{
		var createdDate=new Date(req.body.createDate);//for testing take createDate from req.body.endDate
	}
	console.log(req.body.createDate);
	if (isNaN(createdDate)){
		res.send("Please provide a valid date in valid format");
	}
	var nextDate=createdDate.setDate(createdDate.getDate()+1);
	req.nextDateTime  = nextDate;
	console.log(" createdDateFilter nextDate",nextDate);
	next();
}

//export all the functions
module.exports = { generateRandomNumber, endDateFilter, createdDateFilter};
