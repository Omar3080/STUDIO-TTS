import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menu = [
  ['/', 'dashboard'], ['customers', 'customers'], ['products', 'products'], ['invoices', 'invoices'],
  ['returns', 'returns'], ['payments', 'payments'], ['reports', 'reports'], ['settings', 'settings']
];

export default function AppLayout() {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen flex flex-row-reverse">
      <aside className="w-64 bg-slate-900 text-white p-4 space-y-2">
        <h1 className="font-bold text-xl mb-4">{t('appName')}</h1>
        {menu.map(([path, key]) => <Link className="block p-2 rounded hover:bg-slate-700" key={key} to={path}>{t(`menu.${key}`)}</Link>)}
        <button className="w-full bg-white text-slate-900 mt-4" onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}>
          {t('switchLanguage')}
        </button>
      </aside>
      <main className="flex-1 p-6"><Outlet /></main>
    </div>
  );
}
