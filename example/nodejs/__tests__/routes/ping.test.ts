import supertest from 'supertest';
import assert from 'assert';
import { createApplication } from '../../src/application';

describe('routes/ping', () => {
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(async () => {
    request = supertest(await createApplication());
  });

  it('200', async () => {
    const response: supertest.Response = await request.get('/ping').expect(200);
    assert.strictEqual(response.text, 'pong');
  });
});
