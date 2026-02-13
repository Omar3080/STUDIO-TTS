import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function InvoicesPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/invoices').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'number',title:t('invoice.number')},{key:'status',title:t('invoice.status')},{key:'total',title:t('invoice.total')}]} rows={rows} />;
}
