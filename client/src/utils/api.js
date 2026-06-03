import { z } from 'zod';

const CreateListingSchema = z.object({
  price: z.union([z.number(), z.string().min(1)])
  .transform((val) => Number(val))
  .pipe(z.number().gt(0, { message: "Price must be greater than 0" })),
  dwellings: z.union([z.number(), z.string().min(1)]).transform((val) => Number(val)),
  address: z.string().trim().min(5, 'Address must be at least 5 characters long'),
  nbn: z.union([z.boolean(), z.enum(['true', 'false', 'unknown'])]).default('unknown'),
  pets: z.union([z.boolean(), z.enum(['true', 'false', 'unknown'])]).default('unknown'),
  lat: z.union([z.number(), z.string().min(1)]).transform((val) => Number(val)),
  lng: z.union([z.number(), z.string().min(1)]).transform((val) => Number(val)),
  img: z.string().url('Invalid image URL').or(z.literal('')).optional(),
});

// connect with server code
const BASE_URL = '/api/listings';

export async function getListings(filters = {}) {
  const params = new URLSearchParams();
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.state)    params.set('state', filters.state);
  if (filters.nbn)      params.set('nbn', filters.nbn);
  if (filters.pets)     params.set('pets', filters.pets);
  if (filters.sort)     params.set('sort', filters.sort);
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function createListing(data) {

  // Validate data locally before hit the network
  const validatedData = CreateListingSchema.parse(data);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return res.json();
}

export async function deleteListing(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete listing');
  return res.json();
}
