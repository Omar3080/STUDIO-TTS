import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function ReturnsPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/returns').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'number',title:t('returns.number')},{key:'status',title:t('returns.status')},{key:'total',title:t('returns.total')}]} rows={rows} />;
}
