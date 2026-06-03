import { useState } from 'react';
import { validateAddress } from '../utils/validateAddress';

const TOGGLE_OPTIONS = [
  { value: 'true',    label: 'Yes' },
  { value: 'false',   label: 'No' },
  { value: 'unknown', label: 'Unknown' },
];

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

function TriToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {TOGGLE_OPTIONS.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`flex-1 py-2 text-sm rounded-lg border transition
            ${value === o.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function AddListingForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ price: '', dwellings: '', address: '', nbn: 'unknown', pets: 'unknown', img: '' });
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [validated, setValidated] = useState(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function set(field, value) {
  setForm(f => ({ ...f, [field]: value }));
  
  if (field === 'address') {
    setValidated(null);
    setCoords({ lat: '', lng: '' });
  }
}

  async function handleValidate() {
    if (!form.address.trim()) return setError('Enter an address first');
    
    setValidating(true);
    setError('');
    
    try {
      const result = await validateAddress(form.address);
      console.log('address', result);
      
      setCoords({ lat: result.lat, lng: result.lng });
      setValidated(result);
    } catch {
      setError('Address validation failed. Try again.');
    } finally {
      setValidating(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Check if all fields are added or not
    if (!form.price || !form.dwellings || !form.address) {
      setError('Price, dwellings and address are required'); return;
    }
    if (!coords.lat || !coords.lng) {
      setError('Validate the address first to get coordinates'); return;
    }
    setSubmitting(true);
    setError('');
    
    
    try {

      // Set the value we get from the address picked up from handleValidate()
      const address = validated.streetAddress  + ', ' +  validated.suburb +  ', ' + validated.state + ', ' + 'Australia';

      await onAdd({ ...form , address: address, lat: coords.lat, lng: coords.lng });

      // Reset form 
      setForm({ price: '', dwellings: '', address: '', nbn: 'unknown', pets: 'unknown', img: '' });
      setCoords({ lat: '', lng: '' });
      setValidated(null);
      
      // Close the modal automatically on successful submit
      if (onClose) onClose(); 
      
    } catch(err) {
      console.error(err); // Keeps the error logged in console for debugging

      if (err.issues && err.issues.length > 0) {
        setError(err.issues[0].message);
      } 
      // Fallback if it's a standard Zod error string wrapper or has an errors array
      else if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to add listing. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
   
    <form onSubmit={handleSubmit} className="w-full">
      
      <h2 className="text-base font-semibold text-gray-900 mb-4">Add New Listing</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className={labelCls}>Price ($)</label>
          <input type="number" placeholder="e.g. 150000" min="0"
            value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Dwellings</label>
          <input type="number" placeholder="e.g. 2" min="1"
            value={form.dwellings} onChange={e => set('dwellings', e.target.value)} className={inputCls} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Address</label>
          <div className="flex gap-2">
            <input type="text" placeholder="123 Main St, Sydney, NSW, Australia"
              value={form.address} onChange={e => set('address', e.target.value)} className={inputCls} />
            <button type="button" onClick={handleValidate} disabled={validating}
              className="whitespace-nowrap px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition">
              {validating ? 'Checking…' : 'Validate'}
            </button>
          </div>
          {validated && (
            <p className="mt-1.5 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-1.5 inline-block">
              ✓ {validated.streetAddress}, {validated.suburb} {validated.postcode} {validated.state}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Latitude</label>
          <input type="text" readOnly placeholder="Auto-filled after validation" value={coords.lat}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-100 text-gray-400 font-mono focus:outline-none" />
        </div>
        <div>
          <label className={labelCls}>Longitude</label>
          <input type="text" readOnly placeholder="Auto-filled after validation" value={coords.lng}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-100 text-gray-400 font-mono focus:outline-none" />
        </div>

        <div>
          <label className={labelCls}>Image URL (optional)</label>
          <input type="text" placeholder="https://..." value={form.img}
            onChange={e => set('img', e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>NBN Available</label>
          <TriToggle value={form.nbn} onChange={v => set('nbn', v)} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Pets Allowed</label>
          <TriToggle value={form.pets} onChange={v => set('pets', v)} />
        </div>

      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={submitting}
          className="px-4 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition flex-1 sm:flex-initial text-center justify-center"
        >
          {submitting ? 'Adding…' : 'Save'}
        </button>
      </div>
    </form>
  );
}