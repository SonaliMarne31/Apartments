import houseIcon from '../images/home.png'; 
import deleteIcon from '../images/trash.png';
import petsAllowedIcon from '../images/paw.png';
import notAllowed from '../images/remove.png';
import nbnIcon from '../images/internet.png';


function TriBadge({ value, trueLabel, falseLabel, unknownLabel, trueIcon, falseIcon }) {
  // Common style for the inline image icons
  const iconCls = "w-3.5 h-3.5 object-contain inline-block mr-1";

  if (value === true || value === 'true') {
    return (
      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
        {trueIcon && <img src={trueIcon} alt="" className={iconCls} />}
        {trueLabel}
      </span>
    );
  }
  
  if (value === false || value === 'false') {
    return (
      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
        {falseIcon && <img src={falseIcon} alt="" className={iconCls} />}
        {falseLabel}
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
      {unknownLabel}
    </span>
  );
}

export default function ListingCard({ listing, onDelete }) {
  const { id, price, dwellings, address, nbn, pets, lat, lng, img } = listing;

  return (
    <div className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition">
      {img
        ? <img src={img} alt="Listing" onError={e => e.target.style.display = 'none'}
            className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
        : <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center text-2xl">$$$</div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-1">{address}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1.5">
          <span className="flex items-center gap-1">
            <img src={houseIcon} alt="House icon" className="w-4 h-4 object-contain" />
            {dwellings} dwelling{dwellings !== 1 ? 's' : ''}
          </span>
           <TriBadge 
            value={pets} 
            trueLabel="NBN" 
            falseLabel="No NBN"     
            unknownLabel="NBN Unknown" 
            trueIcon={nbnIcon}
            falseIcon={notAllowed}
          />
          <TriBadge 
            value={pets} 
            trueLabel="Pets allowed" 
            falseLabel="No pets"     
            unknownLabel="Pets Unknown" 
            trueIcon={petsAllowedIcon}
            falseIcon={notAllowed}
          />
        </div>
        <p className="text-xs text-gray-300 font-mono">lat {lat} · lng {lng}</p>
      </div>
      <div className="flex flex-row items-end gap-2 flex-shrink-0">
        <p className="text-lg font-bold text-gray-900">${price.toLocaleString()}</p>
        <button onClick={() => onDelete(id)} aria-label="Delete listing"
          className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg p-1 transition text-base">
          <img src={deleteIcon} alt="" className="w-5 h-5 object-contain" />
        </button>
      </div>
    </div>
  );
}
