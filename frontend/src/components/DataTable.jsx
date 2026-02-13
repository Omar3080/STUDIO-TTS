export default function DataTable({ columns, rows }) {
  return <div className="overflow-auto bg-white rounded-lg shadow"><table className="w-full text-right"><thead><tr>{columns.map(c => <th key={c.key} className="p-3 border-b">{c.title}</th>)}</tr></thead><tbody>{rows.map((r,idx) => <tr key={idx}>{columns.map(c => <td key={c.key} className="p-3 border-b">{r[c.key]}</td>)}</tr>)}</tbody></table></div>;
}
