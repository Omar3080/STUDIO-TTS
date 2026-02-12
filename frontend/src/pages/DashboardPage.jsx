import { useEffect, useState } from 'react';
import client from '../api/client';

export default function DashboardPage() {
  const [data, setData] = useState({});
  useEffect(() => { client.get('/dashboard').then(r => setData(r.data)); }, []);
  const cards = [
    ['مبيعات اليوم', data.salesToday],
    ['مبيعات الشهر', data.salesMonth],
    ['المديونيات', data.outstanding],
    ['أصناف منخفضة المخزون', data.lowStock]
  ];
  return <div className="grid md:grid-cols-4 gap-4">{cards.map(c => <div key={c[0]} className="card"><p>{c[0]}</p><h3 className="text-2xl font-bold">{c[1] ?? 0}</h3></div>)}</div>;
}
