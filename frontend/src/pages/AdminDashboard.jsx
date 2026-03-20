import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState('Checking...')

  useEffect(() => {
    api.get('/health').then(() => setBackendStatus('Online')).catch(() => setBackendStatus('Offline'))
    api.get('/students/').then(res => setStudentCount(res.data.length)).catch(() => {})
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <ul className="space-y-2">
            <li><Link to="/students" className="text-blue-600 hover:underline">Manage Students</Link></li>
            <li><Link to="/setup" className="text-blue-600 hover:underline">Exam Setup</Link></li>
            <li><Link to="/seating" className="text-blue-600 hover:underline">View Seating</Link></li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Status</h3>
          <p>Backend: <span className={backendStatus === 'Online' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{backendStatus}</span></p>
          <p className="mt-2">Total Students: <span className="font-bold">{studentCount}</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Weather</h3>
          <Link to="/weather" className="text-blue-600 hover:underline">Check Exam Day Weather</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
