export default function Table({ columns, rows }) {
  return (
    <div className="overflow-auto card">
      <table className="w-full text-sm">
        <thead><tr>{columns.map(c => <th key={c.key} className="text-right p-2">{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((r, idx) => <tr key={idx} className="border-t">{columns.map(c => <td key={c.key} className="p-2">{r[c.key]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
