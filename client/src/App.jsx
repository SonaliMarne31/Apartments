import { useState, useEffect, useCallback } from 'react';
import AddListingForm from './components/AddListingForm';
import ListingCard from './components/ListingCard';
import StatsBar from './components/StatsBar';
import { getListings, createListing, deleteListing } from './utils/api';

const SORT_OPTIONS = [
  { value: '', label: 'Newest first' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'dwellings', label: 'Dwellings ↓' },
];

const selectCls = 'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:border-gray-400 focus:bg-white transition-all';

export default function App() {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxPrice: '', state: '', nbn: '', pets: '', sort: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch filtered listings
  const fetchListings = useCallback(async (f = filters) => {
    try { 
      setListings(await getListings(f)); 
    } catch (e) {
       console.error(e); 
    }
  }, [filters]);

  // Fetch all the listing w/o any filters. Used for calculating the stats
  const fetchAll = useCallback(async () => {
    try { 
      setAllListings(await getListings({})); 
    } catch (e) { 
      console.error(e); 
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Runs both fetches 
        await Promise.all([fetchListings(), fetchAll()]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [fetchListings, fetchAll]); // Added proper dependency arrays

  function setFilter(key, value) {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      fetchListings(next);
      return next;
    });
  }

  async function handleAdd(data) {
    await createListing(data);
    // re-fetch now that we have a new listing
    await Promise.all([fetchListings(), fetchAll()]);
  }

  async function handleDelete(id) {
    await deleteListing(id);
    // re-fetch now that we have a deleted a listing
    await Promise.all([fetchListings(), fetchAll()]);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header Area with Action Button */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏢 Apartment Listings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and browse apartment listing data</p>
          </div>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="py-2.5 px-4 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap self-start sm:self-center"
          >
            + Add New Listing
          </button>
        </header>

        {/* Dialog Overlay & Box */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto border border-gray-100">

              {/* Close Button */}
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition"
                aria-label="Close dialog"
              >
                ✕
              </button>

              {/* Form Component ( Passed handleAdd to onAdd prop) */}
              <AddListingForm onAdd={handleAdd} onClose={() => setIsDialogOpen(false)} />

            </div>
          </div>
        )}

        <StatsBar listings={allListings} />

        {/* Filter & Listing Container */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mt-6">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-base font-semibold text-gray-900">All Listings</h2>

            {/* Fully responsive filter grid */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={e => setFilter('maxPrice', e.target.value)}
                className={`${selectCls} col-span-2 sm:w-32`}
              />
              <select value={filters.state} onChange={e => setFilter('state', e.target.value)} className={selectCls}>
                <option value="">All states</option>
                {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS'].map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={filters.nbn} onChange={e => setFilter('nbn', e.target.value)} className={selectCls}>
                <option value="">Any NBN</option>
                <option value="true">NBN: Yes</option>
                <option value="false">NBN: No</option>
                <option value="unknown">NBN: Unknown</option>
              </select>
              <select value={filters.pets} onChange={e => setFilter('pets', e.target.value)} className={selectCls}>
                <option value="">Any pets</option>
                <option value="true">Pets: Yes</option>
                <option value="false">Pets: No</option>
                <option value="unknown">Pets: Unknown</option>
              </select>
              <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)} className={`${selectCls} col-span-2 sm:col-span-1`}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-12">Loading listings…</p>
          ) : listings.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No listings match your filters.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map(l => <ListingCard key={l.id} listing={l} onDelete={handleDelete} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}