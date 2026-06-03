
/**
 * validateAddress
 * Calls the server-side validation API and returns structured address data.
 *
 * @param {string} address
 * @returns {Promise<{ streetAddress: string, suburb: string, postcode: number, state: string, lat: number, lng: number }>}
 */
export async function validateAddress(address) {
  const res = await fetch('/api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) throw new Error('Validation failed');
  return res.json();
}
