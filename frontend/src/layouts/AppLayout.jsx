import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menu = ['dashboard','customers','products','sales','invoices','returns','payments','reports','settings','users'];

export default function AppLayout() {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen flex flex-row-reverse">
      <aside className="w-64 bg-slate-900 text-white p-4 space-y-2">
        <h1 className="font-bold text-xl mb-4">{t('appName')}</h1>
        {menu.map(m => <NavLink key={m} to={`/${m}`} className="block px-3 py-2 rounded hover:bg-slate-700">{t(`menu.${m}`)}</NavLink>)}
        <button className="mt-4 bg-indigo-600 px-3 py-2 rounded" onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}>{t('switchLang')}</button>
      </aside>
      <main className="flex-1 p-6"><Outlet /></main>
    </div>
  );
}
