import { useState } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const nav = useNavigate();
  const { t } = useTranslation();
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post('/auth/login', { username, password });
    localStorage.setItem('token', data.accessToken);
    nav('/dashboard');
  };
  return <form onSubmit={submit} className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow space-y-3"><h1 className="text-2xl font-bold">{t('auth.login')}</h1><input className="w-full border p-2" value={username} onChange={e=>setUsername(e.target.value)} /><input type="password" className="w-full border p-2" value={password} onChange={e=>setPassword(e.target.value)} /><button className="bg-indigo-600 text-white px-4 py-2 rounded">{t('auth.enter')}</button></form>;
}
