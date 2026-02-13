import { useEffect, useState } from 'react';
import client from '../api/client';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const { t } = useTranslation();
  useEffect(() => { client.get('/settings').then(r => setSettings(r.data || {})); }, []);
  return <div className="bg-white p-6 rounded shadow space-y-2"><h2 className="text-xl font-bold">{t('settings.title')}</h2><p>{t('settings.company')}: {settings.companyName}</p><p>{t('settings.currency')}: {settings.defaultCurrency}</p><p>{t('settings.negative')}: {String(settings.allowNegativeStock)}</p></div>;
}
