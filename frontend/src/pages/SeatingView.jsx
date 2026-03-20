import { useState, useEffect } from 'react'
import api from '../services/api'

function SeatingView() {
  const [layout, setLayout] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadExisting() }, [])

  const loadExisting = async () => {
    try {
      const res = await api.get('/allocate/')
      setLayout(res.data.layout)
      setStats({ placed: res.data.placed, total: res.data.total_present })
    } catch {
      // no allocation yet, that's fine
    }
  }

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/allocate/', { num_rooms: 2, benches_per_room: 5, seating_type: 'double', damaged_benches: [] })
      setLayout(res.data.layout)
      setStats({ placed: res.data.placed, total: res.data.total_present })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate seating')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Seating Arrangement</h2>
        <button onClick={generate} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Seating'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {!layout && !error && (
        <div className="text-center text-gray-500 py-16">No seating generated yet. Add students and click Generate Seating.</div>
      )}

      {layout && (
        <>
          <div className="mb-4 text-sm text-gray-600 font-medium">
            Placed: {stats?.placed} / {stats?.total} students
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {layout.map((room, r) => (
              <div key={r} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Room {r + 1}</h3>
                <div className="space-y-2">
                  {room.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-2">
                      <span className="text-xs text-gray-400 w-6 flex items-center">{rowIdx + 1}</span>
                      {row.map((seat, seatIdx) => (
                        <div key={seatIdx} className={`flex-1 h-16 border rounded flex items-center justify-center text-xs font-mono ${
                          seat === 'DAMAGED' ? 'bg-red-200 text-red-800' :
                          seat ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {seat === 'DAMAGED' ? '🚫' : seat || 'EMPTY'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SeatingView
