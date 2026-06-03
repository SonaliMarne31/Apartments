const request = require('supertest');
const express = require('express');

function buildApp() {
  jest.resetModules();
  const app = express();
  app.use(express.json());
  app.use('/api/validate', require('../routes/validate'));
  return app;
}

describe('POST /api/validate', () => {

  let app;
  beforeEach(() => { app = buildApp(); });

  // Happy api call - full match
  test('200 and structured response for a valid address', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send({ address: '15 Macquarie Street, Sydney NSW 2000' });
 
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      suburb: 'Sydney',
      state: 'NSW',
    });
  });
 
  // Happy api call - half match
  test('response includes all required fields', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send({ address: 'Melbourne VIC' });
 
    const required = ['streetAddress', 'suburb', 'postcode', 'state', 'lat', 'lng'];
    required.forEach(key => {
      expect(res.body).toHaveProperty(key);
    });
  });


  // Unhappy check if body is present -> return 400
  test('400 when body is empty', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send('');
 
    expect(res.status).toBe(400);
  });

  // Unhappy check if address can be recognized -> return 5xx
  test('500 - For unrecognized address', async () => {
    const res = await request(app)
      .post('/api/validate')
      .send({ address: '999 Nowhere Lane, Fakecity ZZZ' });
 
    // validateAddress throws → express will return 500 unless the route catches it
    expect(res.status).toBeGreaterThanOrEqual(500);
  });


});