import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function PaymentsPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/payments').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'number',title:t('payments.number')},{key:'amount',title:t('payments.amount')},{key:'method',title:t('payments.method')}]} rows={rows} />;
}
