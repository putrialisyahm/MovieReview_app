let mongoose = require("mongoose"); // import mongoose
let {
  user, movies
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

// describe('Movie, () => {
//   before((done) => { //Before each test we empty the database
//     user.deleteMany({email: "user@user.com"}, (err) => {
//       done();
//     });
//   });


  let token;
  describe('/Get All Movie', () => {
    it('it should login user', (done) => {
      chai.request(server) // request to server (index.js)
        .post('/user/login')
        .send({
          email: 'user@user.com',
          password: 'kode12345'
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



  describe('/get Get All Movie', () => {
    it('it should Get All Movie', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/movie/getAllMovie/1')
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })
let movieId;
  describe('/Get Movie Search', () => {
    it('it should Search Movie', (done) => {
      chai.request(server) // request to server (index.js)
        .post('/movie/search/1')
        .send({
          query: "clannad",
        })
          .end((err, res) => {
              movieId = res.body.message.result[0]._id;
              console.log(movieId)
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })
  describe('/Get All Category', () => {
    it('it should Get All Category', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/movie/getAllCategory')
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done()
        })
    })
  })
  
  describe('/Add To WatchList', () => {
    it('it should Add WatchList', (done) => {
      chai.request(server) // request to server (index.js)
        .post('/user/addToWatchList')
          .send({
            movieId: movieId
          })
          .set('Authorization', ('Bearer '+ token))
          .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done()
        })
    })
  })
  describe('/Get Watch List', () => {
    it('it should Get Watch List', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/user/getWatchList')
        .set('Authorization', ('Bearer '+ token))
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })
  describe('/Get Carousel', () => {
    it('it should Get Carousel', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/movie/getCarousel')
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })
  describe('/Get Movie by ID', () => {
    it('it should Get Movie docs', (done) => {
      chai.request(server) // request to server (index.js)
        .get('/movie/getMovieById/'+ movieId)
        .end((err, res) => {
          res.should.have.status(200); // Response Success
          res.body.should.be.an('object'); // Body Response should be an object
          res.body.should.have.property('message'); // Body Response should have 'status' property
          done();
        })
    })
  })