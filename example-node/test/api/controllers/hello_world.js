const should = require('should'); // eslint-disable-line
const supertest = require('supertest');
const server = require('../../../app');

describe('controllers', () => {
  let request;

  before(() => {
    request = supertest(server);
  });

  describe('hello_world', () => {

    describe('GET /hello', () => {

      it('should return a default string', async() => {
        await request
          .get('/hello')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            res.body.should.eql('Hello, stranger!');
          })
        ;
      });

      it('should accept a name parameter', async() => {
        await request
          .get('/hello')
          .query({name: 'Scott'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            res.body.should.eql('Hello, Scott!');
          })
        ;
      });

    });

  });

});
