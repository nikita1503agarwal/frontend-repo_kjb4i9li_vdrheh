import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PredictPage from './components/PredictPage'
import ReportsPage from './components/ReportsPage'
import ProfilePage from './components/ProfilePage'

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
