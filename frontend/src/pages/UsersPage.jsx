import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';
import { useTranslation } from 'react-i18next';

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();
  useEffect(() => { client.get('/users').then(r => setRows(r.data)); }, []);
  return <DataTable columns={[{key:'username',title:t('users.username')},{key:'fullName',title:t('users.fullName')}]} rows={rows} />;
}
