let mongoose = require("mongoose"); // import mongoose
let {
  user
} = require('../models/mongodb/'); // import transaksi models

const uri = "mongodb://localhost:27017/mini_project_dev"; // Database url in mongodb



mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}); // Make connection to mongodb penjualan_dev database

//Require the dev-dependencies
let chai = require('chai'); // import chai for testing assert
let chaiHttp = require('chai-http'); // make virtual server to get/post/put/delete
let server = require('../index.js'); // import app from index
let should = chai.should(); // import assert should from chai
// let transaksi_id; // transaksi_id declaration

chai.use(chaiHttp); // use chaiHttp

describe('User', () => {
  before((done) => { //Before each test we empty the database
    user.deleteMany({email: "user@user.com"}, (err) => {
      done();
    });
  });

  describe('/Post Sign Up User', () => {
    it('it should Sign Up a A user', (done) => {
      chai.request(server) // request to server (index.js)
        .post('/user/signup')
        .send({
          username: 'user1',
          email: 'user@user.com',
          password: 'kode1234',
          passwordConfirmation: 'kode1234',
          fullName: 'user Full Name',
        })
        .end((err, res) => {
          res.should.have.status(200); // Response should have status 200
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          res.body.should.have.property('token'); // Body Response should have 'data' property
          done();
        });
    });
  });

  let token;
  describe('/Post Login User', () => {
    it('it should login user', (done) => {
      chai.request(server) // request to server (index.js)
        .post('/user/login')
        .send({
          email: 'user@user.com',
          password: 'kode1234'
        })
        .end((err, res) => {
          token = res.body.token;
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          res.body.should.have.property('token'); // Body Response should have 'data' property
          done();
        })
    })
  })



  // describe('/Put Insert PP', () => {
  //   it('it should Insert PP', (done) => {
  //     chai.request(server) // request to server (index.js)
  //       .put('/user/insertPP')
  //       .send({
  //         image: 'image'

  //       })
  //       .end((err, res) => {
  //         res.should.have.status(200); // Response Success
  //         res.body.should.be.an('object'); // Body Response should be an object
  //         res.body.should.have.property('message'); // Body Response should have 'status' property
  //         res.body.should.have.property('result'); // Body Response should have 'status' property
  //         done();
  //       })
  //   })
  // })

  describe('/Put Change Name', () => {
    it('it should Change Name', (done) => {
      chai.request(server) // request to server (index.js)
        .put('/user/changeName')
        .send({
          fullName: 'namabaru2'

        })
        .set('Authorization', ('Bearer '+ token))
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })

  describe('/Put Change Password', () => {
    it('it should Change Password', (done) => {
      chai.request(server) // request to server (index.js)
        .put('/user/changePass')
        .send({
          oldPassword: 'kode1234',
          newPassword: 'kode12345',
          passwordConfirmation: 'kode12345'

        })
        .set('Authorization', ('Bearer '+ token))
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })
  describe('/Get User Profile', () => {
    it('it should User Profile', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/user/getUserProfile')
        
        .set('Authorization', ('Bearer '+ token))
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done()
        })
    })
  })
})