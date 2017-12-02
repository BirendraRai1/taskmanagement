//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let taskManagement = require('../app/models/taskAssign');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('task', () => {
    beforeEach((done) => { //Before each test we empty the database
      taskManagement.remove({}, (err) => { 
       done();         
     });     
    });

  //Test the GET route  
  describe('/GET taskManagement', () => {
    it('it should GET all the task', (done) => {
      chai.request(server)
      .get('/allTask')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  var today=new Date();

  //Test the /POST route
  describe('/POST taskManagement', () => {

    it('it should not POST a task when taskEndDate is less than current date', (done) => {

      let task= {
        taskName:"checkbox question",
        description:"hindi",
        taskEndDate:today.setDate(today.getDate() - 1),
        created_by:"satyendra"
      }
      chai.request(server)
      .post('/createTask')
      .send(task)
      .end((err, res) => {
       // console.log("endDate test",res.body);
       res.body.should.have.status(400);
       res.body.should.be.a('object');
       res.body.should.have.property('message').eql('taskend date should be greater than or equal to start date');
       done();
     });
    });
    it('it should not POST a task without taskName field', (done) => {
      let task= {
        description:"hindi",
        taskEndDate:today.setDate(today.getDate() + 5),
        created_by:"satyendra"
      }
      chai.request(server)
      .post('/createTask')
      .send(task)
      .end((err, res) => {
        console.log("taskName test",res.body);
        res.body.should.have.status(400);
        res.body.should.be.a('object');
        res.body.message.should.have.property('errors');
        res.body.message.errors.should.have.property('taskName');
        done();
      });
    });
    
    it('it should POST a task ', (done) => {
      let task = {
        description:"hindi",
        taskEndDate:today.setDate(today.getDate() + 7),
        created_by:"satyendra",
        taskName:"subjective questions"
      }
      chai.request(server)
      .post('/createTask')
      .send(task)
      .end((err, res) => {
        //console.log("success post",res.body)
        res.body.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('taskManagement successfully added!');
        res.body.data.should.have.property('description');
        res.body.data.should.have.property('taskEndDate');
        res.body.data.should.have.property('created_by');
        res.body.data.should.have.property('taskName');
        done();
      });
    });
  });

  //Test the /GET route to get a task with particular name
  describe('/GET /allTask with particular user name', () => {
    it('it should GET all task by the given user', (done) => {
      let task = new taskManagement({
        taskName:"social studies",
        taskEndDate:today.setDate(today.getDate() +8),
        description:"objective questions",
        created_by:"neha"
      });
      task.save((err, task) => {
        chai.request(server)
        .get('/allTask/' + task.created_by)
        .end((err, res) => {
         // console.log(res.body);
         res.body.should.have.status(200);
         res.body.should.be.a('object');
         res.body.data[0].should.have.property('description');
         res.body.data[0].should.have.property('taskEndDate');
         res.body.should.have.property('message').eql('successfully fetched');
         res.body.data[0].should.have.property('created_by').eql(task.created_by);;
         done();
       });
      });

    });
  });


  //Test the /PUT route to update a task with particular id
  describe('/PUT/:id/updateTask', () => {
    it('it should UPDATE a task given the id', (done) => {
      let task = new taskManagement({
       taskName:"yoga",
       taskEndDate:today.setDate(today.getDate() + 2),
       description:"fit for health",
       created_by:"mahesh"

     })
      task.save((err, task) => {
        //console.log("update task",task)
        chai.request(server)
        .put('/'+task.id+'/'+'updateTask')
        .send({taskName:"yoga",taskEndDate:today.setDate(today.getDate() + 7),description:"fit for health",created_by:"mahesh"})
        .end((err, res) => {
          console.log("update given taskid",res.body);
          res.body.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('updated successfully');
          done();
        });
      });
    });
  });

//Test the /DELETE/:id route
describe('/DELETE/:id deleteTask', () => {
  it('it should DELETE a task given the id', (done) => {
    let task = new taskManagement({
      taskName:"music",
      taskEndDate:today.setDate(today.getDate() + 2),
      created_by:"bandhna",
      description:"sounds interesting"
    })
    task.save((err, task) => {
      chai.request(server)
      .delete('/'+task.id+'/deleteTask')
      .end((err, res) => {
        console.log("deleted message ",res.body);
        res.body.should.have.property('status').eql(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Task successfully deleted!');
        res.body.data.should.have.property('ok').eql(1);
        res.body.data.should.have.property('n').eql(0);
        done();
      });
    });
  });
});


});