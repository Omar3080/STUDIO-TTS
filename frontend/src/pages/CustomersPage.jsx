import { useEffect, useState } from 'react';
import client from '../api/client';
import Table from '../components/Table';

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { client.get('/customers').then(r => setRows(r.data)); }, []);
  return <Table columns={[{ key: 'code', label: 'كود العميل' }, { key: 'name', label: 'الاسم' }, { key: 'phone', label: 'الهاتف' }, { key: 'balance', label: 'الرصيد' }]} rows={rows} />;
}
