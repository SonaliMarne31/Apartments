/**
 * validateAddress
 * Validates an address string and returns structured address components
 * with coordinates. In this implementation, returns a randomly selected
 * entry from a pool of real Australian addresses.
 *
 * @param {string} address - The raw address string to validate
 * @returns {{ streetAddress: string, suburb: string, postcode: number, state: string, lat: number, lng: number }}
 */

const ADDRESS_POOL = [
  { streetAddress: '12 Harbour St',   suburb: 'Sydney',      postcode: 2000, state: 'NSW', lat: -33.8688, lng: 151.2093 },
  { streetAddress: '88 George St',    suburb: 'Parramatta',  postcode: 2150, state: 'NSW', lat: -33.8148, lng: 151.0017 },
  { streetAddress: '5 Collins St',    suburb: 'Melbourne',   postcode: 3000, state: 'VIC', lat: -37.8136, lng: 144.9631 },
  { streetAddress: '22 Brunswick St', suburb: 'Fitzroy',     postcode: 3065, state: 'VIC', lat: -37.7963, lng: 144.9779 },
  { streetAddress: '301 Queen St',    suburb: 'Brisbane',    postcode: 4000, state: 'QLD', lat: -27.4698, lng: 153.0251 },
  { streetAddress: '14 Hay St',       suburb: 'Perth',       postcode: 6000, state: 'WA',  lat: -31.9505, lng: 115.8605 },
  { streetAddress: '77 Rundle Mall',  suburb: 'Adelaide',    postcode: 5000, state: 'SA',  lat: -34.9285, lng: 138.6007 },
  { streetAddress: '9 Elizabeth St',  suburb: 'Hobart',      postcode: 7000, state: 'TAS', lat: -42.8821, lng: 147.3272 },
  { streetAddress: '42 Flinders St',  suburb: 'Melbourne',   postcode: 3000, state: 'VIC', lat: -37.8183, lng: 144.9671 },
  { streetAddress: '100 King St',     suburb: 'Newtown',     postcode: 2042, state: 'NSW', lat: -33.8978, lng: 151.1794 },
  { streetAddress: '15 Macquarie St', suburb: 'Sydney',      postcode: 2000, state: 'NSW', lat: -33.8674, lng: 151.2108 },
  { streetAddress: '200 Adelaide St', suburb: 'Brisbane',    postcode: 4000, state: 'QLD', lat: -27.4654, lng: 153.0234 },
];

function validateAddress(address) {

  if (!address || typeof address !== 'string') {
    throw new Error('Invalid input');
  }

  const cleanInput = address.toLowerCase().trim();

  // 1. Filter the pool to find items that match what the user typed
  const matches = ADDRESS_POOL.filter(item => 
    cleanInput.includes(item.state.toLowerCase()) && 
    cleanInput.includes(item.suburb.toLowerCase())
  );

  // 2. If we found matching addresses, pick a random one from those matches
  if (matches.length > 0) {
    const pick = matches[Math.floor(Math.random() * matches.length)];
    return { ...pick };
  }

  // 3. Fallback: If no matches are found, simulate a validation failure
  throw new Error('Address could not be validated');
}

module.exports = { validateAddress };
