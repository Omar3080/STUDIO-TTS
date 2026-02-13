import { useEffect, useState } from 'react';
import client from '../api/client';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const { t } = useTranslation();
  useEffect(() => { client.get('/reports/dashboard').then(r => setStats(r.data)).catch(() => {}); }, []);
  const cards = [
    { label: t('dashboard.salesToday'), value: stats.salesToday || 0 },
    { label: t('dashboard.salesMonth'), value: stats.salesMonth || 0 },
    { label: t('dashboard.outstanding'), value: stats.outstanding || 0 },
    { label: t('dashboard.lowStock'), value: stats.lowStock || 0 }
  ];
  return <div className="grid md:grid-cols-4 gap-4">{cards.map(c => <div key={c.label} className="bg-white p-4 rounded shadow"><p className="text-slate-500">{c.label}</p><h2 className="text-2xl font-bold">{c.value}</h2></div>)}</div>;
}
