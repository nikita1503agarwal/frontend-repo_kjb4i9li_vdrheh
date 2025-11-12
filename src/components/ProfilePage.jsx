import { useEffect, useState } from 'react'

export default function ProfilePage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [profiles, setProfiles] = useState([])
  const [form, setForm] = useState({owner_name:'', business_name:'', email:'', phone:'', address:'', industry:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async ()=>{
    try{
      const res = await fetch(`${baseUrl}/api/profile`)
      const data = await res.json()
      setProfiles(Array.isArray(data)? data : [])
    } catch{}
  }

  useEffect(()=>{ load() },[])

  const addProfile = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      const res = await fetch(`${baseUrl}/api/profile`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const data = await res.json()
      if(!res.ok){ throw new Error(data?.detail || 'Failed to save profile') }
      setProfiles([{...form, _id:data.id}, ...profiles])
      setForm({owner_name:'', business_name:'', email:'', phone:'', address:'', industry:''})
    } catch(err){ setError(err.message) }
    finally{ setLoading(false) }
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
        <button disabled={loading} className="bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:opacity-50">Simpan Profil</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
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
