const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const logger=require('morgan');
const config=require('config');


app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

mongoose.Promise = global.Promise;


mongoose.connect(config.DBHost);
mongoose.connection.once('open',function(){
	console.log("Database Connection Established Successfully.");
});
mongoose.connection.on('error', function() {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  //process.exit(1);
});

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(logger('dev')); //'combined' outputs the Apache style LOGs
}
require('./app/models/taskAssign.js');
//mongoose.model('task');


app.use(function(req,res,next){
	console.log('Request URL:',req.originalUrl);
	console.log('Request Type:', req.method);
	next();
});


var route=require('./app/controllers/task');

route.controllerFunction(app);

//error handling middleware
app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(err ||500).send('Something broke!')
});

app.listen(3000,()=>console.log("server running on port 3000"));

module.exports = app; // for testing
