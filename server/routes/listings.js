const express = require('express');
const router = express.Router();

let listings = [
  { 
    id: 1, 
    price: 150000, 
    dwellings: 1, 
    address: '123 Main St, Sydney, NSW, Australia',      
    nbn: true,    
    pets: true,      
    lat: -33.8688, 
    lng: 151.2093, 
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80', 
    date: Date.now() 
  },
  { 
    id: 2, 
    price: 22000,  
    dwellings: 2, 
    address: '456 Oak Ave, North Sydney, NSW, Australia', 
    nbn: false,   
    pets: false,     
    lat: -33.8950, 
    lng: 151.1700, 
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80', 
    date: Date.now() 
  },
  { 
    id: 3, 
    price: 18000,  
    dwellings: 1, 
    address: '789 Pine Rd, Epping, VIC, Australia',       
    nbn: true,    
    pets: 'unknown', 
    lat: -37.8136, 
    lng: 144.9631, 
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80', 
    date: Date.now() 
  },
  { 
    id: 4, 
    price: 30000,  
    dwellings: 3, 
    address: '101 Elm Ln, Melbourne, VIC, Australia',     
    nbn: true,    
    pets: true,      
    lat: -37.8170, 
    lng: 144.9670, 
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=80', 
    date: Date.now() 
  },
  { 
    id: 5, 
    price: 16000,  
    dwellings: 2, 
    address: '222 Birch Blvd, Fitzroy, VIC, Australia',   
    nbn: true,    
    pets: false,     
    lat: -37.8200, 
    lng: 145.0000, 
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80', 
    date: Date.now() 
  },
];
let nextId = 6;

// GET /api/listings
router.get('/', (req, res) => {
  const { maxPrice, state, nbn, pets, sort } = req.query;

  // Helper to convert frontend string filters to backend types
  const parseToggle = val => val === 'unknown' ? 'unknown' : val === 'true';

  // 1. Run all filters 
  let result = listings.filter(l => {
    if (maxPrice && l.price > parseInt(maxPrice)) return false;
    if (state && !l.address.includes(state)) return false;
    if (nbn && l.nbn !== parseToggle(nbn)) return false;
    if (pets && l.pets !== parseToggle(pets)) return false;
    return true;
  });

  // 2. Apply Sorting
  const sortMethods = {
    'price-asc':  (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'dwellings':  (a, b) => b.dwellings - a.dwellings,
    'default':    (a, b) => b.date - a.date
  };

  const sortFn = sortMethods[sort] || sortMethods['default'];
  result.sort(sortFn);

  res.json(result);
});


// POST /api/listings
router.post('/', (req, res) => {
  const { price, dwellings, address, nbn, pets, lat, lng, img } = req.body;

  // 1. Do some validation
  if (!price || !dwellings || !address || lat == null || lng == null) {
    return res.status(400).json({ error: 'price, dwellings, address, lat, lng are required' });
  }

  // 2. Mapper for tri state
  const parseTriState = v => (v === true || v === 'true' ? true : v === false || v === 'false' ? false : 'unknown');

  // 3. Directly build the structured listing object
  const listing = {
    id: nextId++,
    price: parseInt(price, 10),
    dwellings: parseInt(dwellings, 10),
    address,
    nbn: parseTriState(nbn),
    pets: parseTriState(pets),
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    img: img || '',
    date: Date.now(),
  };

  listings.unshift(listing); // Puts the newest listing at the very front of the array
  res.status(201).json(listing); // 201 status code means "Created successfully"
});

// DELETE 
router.delete('/:id', (req, res) => {
  const idx = listings.findIndex(l => l.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Listing not found' });
  listings.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
