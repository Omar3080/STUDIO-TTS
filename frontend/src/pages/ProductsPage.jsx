import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/products').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'sku',title:t('products.sku')},{key:'name',title:t('products.name')},{key:'sellingPrice',title:t('products.price')},{key:'quantityOnHand',title:t('products.qty')}]} rows={rows} />;
}
