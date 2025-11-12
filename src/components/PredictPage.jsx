import { useState } from 'react'

export default function PredictPage(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ period:'', sales:'', orders:'', marketing_spend:'' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
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
      if(!res.ok){ throw new Error(data?.detail || 'Prediction failed') }
      setResult(data)
    } catch(err){
      setError(err.message)
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
        {error && <p className="text-sm text-red-600">{error}</p>}
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
