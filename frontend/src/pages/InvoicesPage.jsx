import { useState } from 'react';
import client from '../api/client';

export default function InvoicesPage() {
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const [form, setForm] = useState({ type: 'CASH', customerId: '', paymentMethod: 'CASH', discountType: 'AMOUNT', discountValue: 0, vatRate: 0 });
  const save = async () => { await client.post('/invoices', { ...form, items }); alert('تم الحفظ'); };
  return <div className="card space-y-3"><h2 className="font-bold">فاتورة جديدة</h2><input placeholder="customerId" onChange={e=>setForm({ ...form, customerId: e.target.value })}/>{items.map((i, idx)=><div key={idx} className="grid grid-cols-4 gap-2"><input placeholder="productId" onChange={e=>{const x=[...items];x[idx].productId=e.target.value;setItems(x);}}/><input type="number" value={i.quantity} onChange={e=>{const x=[...items];x[idx].quantity=+e.target.value;setItems(x);}}/><input type="number" value={i.unitPrice} onChange={e=>{const x=[...items];x[idx].unitPrice=+e.target.value;setItems(x);}}/><button onClick={()=>setItems([...items,{ productId:'', quantity:1, unitPrice:0, discount:0 }])}>+</button></div>)}<button className="bg-slate-900 text-white" onClick={save}>حفظ الفاتورة</button></div>;
}
