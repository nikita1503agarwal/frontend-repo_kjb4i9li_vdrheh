import { useEffect, useState } from 'react'

export default function ReportsPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [reports, setReports] = useState([])
  const [form, setForm] = useState({title:'', notes:'', status:'open'})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadReports = async ()=>{
    try{
      const res = await fetch(`${baseUrl}/api/reports`)
      const data = await res.json()
      setReports(Array.isArray(data)? data : [])
    } catch{}
  }

  useEffect(()=>{ loadReports() },[])

  const addReport = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      const res = await fetch(`${baseUrl}/api/reports`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const data = await res.json()
      if(!res.ok){ throw new Error(data?.detail || 'Failed to create report') }
      setReports([{...form, _id:data.id}, ...reports])
      setForm({title:'', notes:'', status:'open'})
    } catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Monitor Report</h1>
      <form onSubmit={addReport} className="bg-white border rounded-lg p-4 grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <textarea className="border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button disabled={loading} className="bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50">Tambah</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <div className="mt-4 grid gap-3">
        {reports.map((r,i)=> (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{r.title}</h3>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{r.status}</span>
            </div>
            {r.notes && <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{r.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
