import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/customers').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'code',title:t('customers.code')},{key:'name',title:t('customers.name')},{key:'phone',title:t('customers.phone')},{key:'currentBalance',title:t('customers.balance')}]} rows={rows} />;
}
