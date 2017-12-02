function generateRandomNumber(req,res,next){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 8; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	req.suffix_id=text;
	next();
}

function endDateFilter(req,res,next){
	var endDate=new Date(req.query.endDate);
	console.log(req.query.createDate);
	if (isNaN(endDate)){
		res.send("Please provide a valid date in valid format");
	}
	req.previousDateTime  = endDate.getTime();
	next();
}

function createdDateFilter(req,res,next){
	var createdDate=new Date(req.query.createDate);
	console.log(req.query.createDate);
	if (isNaN(createdDate)){
		res.send("Please provide a valid date in valid format");
	}
	var nextDate=new Date(req.query.createDate);
	nextDate.setDate(nextDate.getDate()+1);
	req.createdDateTime = createdDate.getTime();
	req.nextDateTime  = nextDate.getTime();
	next();
}

//export all the functions
module.exports = { generateRandomNumber, endDateFilter, createdDateFilter};
