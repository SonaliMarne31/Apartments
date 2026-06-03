const request = require('supertest');
const express = require('express');

function buildApp() {
  jest.resetModules();
  const app = express();
  app.use(express.json());
  app.use('/api/listings', require('../routes/listings'));
  return app;
}

describe('GET /api/listings', () => {
  let app;
  beforeEach(() => { app = buildApp(); });

  // Happy path - 200 for listing
  test('200 and returns an array', async () => {
    const res = await request(app).get('/api/listings');
    // console.log('res', res);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Happy path. - test filter
  test('?state=VIC returns only VIC listings', async () => {
      const res = await request(app).get('/api/listings?state=VIC');
      expect(res.status).toBe(200);
      res.body.forEach(l => {
        expect(l.address).toContain('VIC');
    });
  });
});

describe('POST /api/listings', () => {
  let app;
  beforeEach(() => { app = buildApp(); });

  const validListing = {
    price: 25000,
    dwellings: 2,
    address: '10 Bridge St, Sydney, NSW, Australia',
    nbn: 'true',
    pets: 'false',
    lat: -33.8688,
    lng: 151.2093,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  };
 
  // Happy path - create listing
  test('201 and returns the created listing', async () => {
    const res = await request(app)
      .post('/api/listings')
      .send(validListing);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      price: validListing.price,
      dwellings: validListing.dwellings,
      address: validListing.address,
    });
  });

  // Unhappy - missing price
  test('missing price returns 400', async () => {
    const { price, ...body } = validListing;
    const res = await request(app).post('/api/listings').send(body);
    expect(res.status).toBe(400);
  });


});

describe('DELETE /api/listings/:id', () => {
  let app;
  beforeEach(() => { app = buildApp(); });
  const validListing = {
    price: 25000,
    dwellings: 2,
    address: '10 Bridge St, Sydney, NSW, Australia',
    nbn: 'true',
    pets: 'false',
    lat: -33.8688,
    lng: 151.2093,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  };
  
  // Happy path for delete listing
  test('200 and success:true for an existing listing', async () => {
    // Create a listing first
    const createRes = await request(app).post('/api/listings').send(validListing);
    const id = createRes.body.id;
 
    const delRes = await request(app).delete(`/api/listings/${id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body).toEqual({ success: true });
  });

});