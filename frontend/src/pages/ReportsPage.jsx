import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/reports/customers-balance').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'code',title:t('reports.code')},{key:'name',title:t('reports.customer')},{key:'currentBalance',title:t('reports.balance')}]} rows={rows} />;
}
