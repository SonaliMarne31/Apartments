const { validateAddress } = require('../utils/validateAddress');

describe('validateAddress()', () => {

  // Happy Path - full match
  test('returns a result for a Sydney NSW address', () => {
    const result = validateAddress('15 Macquarie Street, Sydney NSW 2000');
    expect(result).toMatchObject({
        suburb: 'Sydney',
        state: 'NSW',
    });
    expect(result.postcode).toBeGreaterThan(0);

  });

  // Happy Path - full match
  test('returns a result for a Melbourne VIC address', () => {
    const result = validateAddress('5 Collins St, Melbourne VIC 3000');
    expect(result).toMatchObject({
      suburb: 'Melbourne',
      state: 'VIC',
    });
  });

  // Happy Path - State + suburb match, return a random pick
  test('returns a result for a Brisbane QLD address', () => {
    const result = validateAddress('123 test address, Brisbane QLD');
    expect(result).toMatchObject({
      suburb: 'Brisbane',
      state: 'QLD',
    });
  });


  // Unhappy address
  test('throws when address does not match any pool entry', () => {
    expect(() => validateAddress('123 Fake St, Faketown ZZZ')).toThrow(
      'Address could not be validated'
    );
  });


});

// Check the entire return object 
describe('Return value structure', () => {

    test('result has all required fields', () => {
      const result = validateAddress('Melbourne VIC');
      const requiredKeys = ['streetAddress', 'suburb', 'postcode', 'state', 'lat', 'lng'];
      // console.log('result', result);
      requiredKeys.forEach(key => {
        expect(result).toHaveProperty(key);
      });
    });

});