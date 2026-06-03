export default function StatsBar({ listings }) {
  const total = listings.length;
  const avgPrice = total ? Math.round(listings.reduce((s, l) => s + l.price, 0) / total) : 0;
  const nbnCount = listings.filter(l => l.nbn === true || l.nbn === 'true').length;
  const totalDwellings = listings.reduce((s, l) => s + l.dwellings, 0);

  const stats = [
    { label: 'Total listings',  value: total },
    { label: 'Avg price',       value: `$${avgPrice.toLocaleString()}` },
    { label: 'NBN connected',   value: nbnCount },
    { label: 'Total dwellings', value: totalDwellings },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {stats.map(s => (
        <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">{s.label}</p>
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
