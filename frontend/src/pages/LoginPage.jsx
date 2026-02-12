import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function LoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: 'admin', password: 'Admin@123' });
  const submit = async e => {
    e.preventDefault();
    const { data } = await client.post('/auth/login', form);
    localStorage.setItem('accessToken', data.accessToken);
    nav('/');
  };
  return <div className="min-h-screen grid place-items-center"><form onSubmit={submit} className="card w-96 space-y-3"><h2 className="font-bold">تسجيل الدخول</h2><input value={form.username} onChange={e=>setForm({ ...form, username: e.target.value })}/><input type="password" value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })}/><button className="bg-slate-900 text-white w-full">دخول</button></form></div>;
}
