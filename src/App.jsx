import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'

function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  useEffect(() => {
    fetch(`${baseUrl}/api/metrics`).then(r=>r.json()).then(setMetrics).catch(()=>{})
  }, [])
  const totalSales = metrics.reduce((s,m)=>s+(m.sales||0),0)
  const totalOrders = metrics.reduce((s,m)=>s+(m.orders||0),0)
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-white">
          <p className="text-sm text-gray-500">Total Periods</p>
          <p className="text-2xl font-bold">{metrics.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-white">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">Rp {totalSales.toLocaleString('id-ID')}</p>
        </div>
        <div className="p-4 rounded-lg border bg-white">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders.toLocaleString('id-ID')}</p>
        </div>
        <HealthCard />
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Period</th>
              <th className="p-2">Sales</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Marketing</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m,i)=> (
              <tr key={i} className="border-t">
                <td className="p-2">{m.period?.slice(0,10)}</td>
                <td className="p-2">Rp {Number(m.sales||0).toLocaleString('id-ID')}</td>
                <td className="p-2">{m.orders}</td>
                <td className="p-2">Rp {Number(m.marketing_spend||0).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function HealthCard(){
  return (
    <div className="p-4 rounded-lg border bg-white">
      <p className="text-sm text-gray-500">Business Health</p>
      <p className="text-2xl font-bold text-green-600">Stable</p>
      <p className="text-xs text-gray-500">Based on recent metrics</p>
    </div>
  )
}

function PredictPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ period:'', sales:'', orders:'', marketing_spend:'' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/predict`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          period: form.period,
          sales: Number(form.sales),
          orders: Number(form.orders),
          marketing_spend: Number(form.marketing_spend)
        })
      })
      const data = await res.json()
      setResult(data)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Predict</h1>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 border rounded-lg">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Period</label>
          <input type="date" value={form.period} onChange={e=>setForm({...form, period:e.target.value})} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sales (Rp)</label>
            <input type="number" value={form.sales} onChange={e=>setForm({...form, sales:e.target.value})} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Orders</label>
            <input type="number" value={form.orders} onChange={e=>setForm({...form, orders:e.target.value})} className="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Marketing Spend (Rp)</label>
          <input type="number" value={form.marketing_spend} onChange={e=>setForm({...form, marketing_spend:e.target.value})} className="w-full border rounded px-3 py-2" required />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading? 'Predicting...' : 'Predict'}
        </button>
      </form>
      {result && (
        <div className="mt-4 bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Result</h3>
          <p>Predicted Sales: <span className="font-bold">Rp {Number(result.predicted_sales||0).toLocaleString('id-ID')}</span></p>
          <p>Predicted Orders: <span className="font-bold">{result.predicted_orders}</span></p>
        </div>
      )}
    </div>
  )
}

function ReportsPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [reports, setReports] = useState([])
  const [form, setForm] = useState({title:'', notes:'', status:'open'})
  useEffect(()=>{ fetch(`${baseUrl}/api/reports`).then(r=>r.json()).then(setReports).catch(()=>{}) },[])
  const addReport = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/reports`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    const data = await res.json()
    setReports([{...form, _id:data.id}, ...reports])
    setForm({title:'', notes:'', status:'open'})
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
        <button className="bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700">Tambah</button>
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

function ProfilePage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [profiles, setProfiles] = useState([])
  const [form, setForm] = useState({owner_name:'', business_name:'', email:'', phone:'', address:'', industry:''})
  useEffect(()=>{ fetch(`${baseUrl}/api/profile`).then(r=>r.json()).then(setProfiles).catch(()=>{}) },[])
  const addProfile = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/profile`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    const data = await res.json()
    setProfiles([{...form, _id:data.id}, ...profiles])
    setForm({owner_name:'', business_name:'', email:'', phone:'', address:'', industry:''})
  }
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Profil UMKM</h1>
      <form onSubmit={addProfile} className="bg-white border rounded-lg p-4 grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Nama Pemilik" value={form.owner_name} onChange={e=>setForm({...form, owner_name:e.target.value})} required />
          <input className="border rounded px-3 py-2" placeholder="Nama Usaha" value={form.business_name} onChange={e=>setForm({...form, business_name:e.target.value})} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Telepon" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>
        <input className="border rounded px-3 py-2" placeholder="Alamat" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Industri" value={form.industry} onChange={e=>setForm({...form, industry:e.target.value})} />
        <button className="bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700">Simpan Profil</button>
      </form>
      <div className="mt-4 grid gap-3">
        {profiles.map((p,i)=>(
          <div key={i} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold">{p.business_name}</h3>
            <p className="text-sm text-gray-600">Owner: {p.owner_name} • {p.email}</p>
            {p.address && <p className="text-sm text-gray-600">{p.address}</p>}
            {p.industry && <p className="text-sm text-gray-600">{p.industry}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AppWrapper(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}
