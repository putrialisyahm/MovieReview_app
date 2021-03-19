let mongoose = require("mongoose"); // import mongoose
let {
    user,
    movies,
    review
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


describe('Review', () => {
    before((done) => { //Before each test we empty the database
        review.deleteMany({}, (err) => {
            done();
        });
    });

    let token;
    describe('/Get login First', () => {
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

    describe('/Post Add Review', () => {
        it('it should Add Review', (done) => {
            chai.request(server) // request to server (index.js)
                .post('/review/addReview/' + movieId)
                .send({
                    review: 'bagus',
                    rating: 4
                })
                .set('Authorization', ('Bearer ' + token))
                .end((err, res) => {
                    res.should.have.status(200); // Response Success
                    res.body.should.be.an('object'); // Body Response should be an object
                    res.body.should.have.property('message'); // Body Response should have 'status' property
                    done()
                })
        })
    })
    let reviewId;
    describe('/get Get Review', () => {
        it('it should Get Review', (done) => {
            chai.request(server) // request to server (index.js)
                .get('/user/getMyReview/')
                .set('Authorization', ('Bearer ' + token))
                .end((err, res) => {
                    reviewId = res.body.message.result[0]._id;
                    res.should.have.status(200); // Response Success
                    res.body.should.be.an('object'); // Body Response should be an object
                    res.body.should.have.property('message'); // Body Response should have 'status' property
                    done()
                })
        })
    })

    describe('/Post Update Review', () => {
        it('it should Update Review', (done) => {
            chai.request(server) // request to server (index.js)
                .put('/review/updateReview/' + reviewId)
                .send({
                    review: 'entahlah',
                    rating: 3
                })
                .set('Authorization', ('Bearer ' + token))
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200); // Response Success
                    res.body.should.be.an('object'); // Body Response should be an object
                    res.body.should.have.property('message'); // Body Response should have 'status' property
                    done()
                })
        })
    })
    describe('/Post get Review of a movie', () => {
        it('it should get review of a movie', (done) => {
            chai.request(server) // request to server (index.js)
                .get('/review/getReview/' + movieId + '/1')
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200); // Response Success
                    res.body.should.be.an('object'); // Body Response should be an object
                    res.body.should.have.property('message'); // Body Response should have 'status' property
                    done()
                })
        })
    })
    describe('/Post delete Review', () => {
        it('it should delete Review', (done) => {
            chai.request(server) // request to server (index.js)
                .delete('/review/deleteReview/' + reviewId)
                .set('Authorization', ('Bearer ' + token))
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200); // Response Success
                    res.body.should.be.an('object'); // Body Response should be an object
                    res.body.should.have.property('message'); // Body Response should have 'status' property
                    done()
                })
        })
    })

    
});