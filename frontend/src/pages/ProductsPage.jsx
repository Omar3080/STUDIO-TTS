import { useEffect, useState } from 'react';
import client from '../api/client';
import Table from '../components/Table';

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { client.get('/products').then(r => setRows(r.data)); }, []);
  return <Table columns={[{ key: 'sku', label: 'SKU' }, { key: 'name', label: 'اسم الصنف' }, { key: 'salePrice', label: 'سعر البيع' }, { key: 'quantityOnHand', label: 'الكمية' }]} rows={rows} />;
}
