const assert = require('assert');
const supertest = require('supertest');
const test = require('../../');

describe('controllers/ping', () => {
  let request;

  before(() => {
    request = supertest(test.app);
  });

  describe('show', () => {

    it('pongが返される', async() => {
      await request
        .get('/ping')
        .expect(200)
        .then(res => {
          assert(res.text === 'pong');
        })
      ;
    });

  });

});
