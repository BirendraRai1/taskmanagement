exports.endDateFilter=function(req,res,next){
	var endDate=new Date(req.query.endDate);
	console.log(req.query.createDate);
	if (isNaN(endDate)){
		res.send("Please provide a valid date in valid format");
	}
	req.previousDateTime  = endDate.getTime();
	next();
}