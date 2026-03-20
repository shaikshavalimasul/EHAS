import { useState } from 'react'
import api from '../services/api'

function ExamSetup() {
  const [form, setForm] = useState({ exam_type: 'semester', num_rooms: 2, benches_per_room: 5, seating_type: 'double' })
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await api.post('/exam-config/', { ...form, damaged_benches: [] })
      setMsg('Exam config saved successfully!')
    } catch {
      setMsg('Error saving config. Try again.')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Exam Setup</h2>
      {msg && <div className={`p-3 rounded mb-4 ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</div>}
      <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Exam Type</label>
          <select value={form.exam_type} onChange={e => setForm({...form, exam_type: e.target.value})} className="w-full p-3 border rounded-lg">
            <option value="semester">Semester Exam</option>
            <option value="mid">Mid Exam</option>
            <option value="group_discussion">Group Discussion</option>
            <option value="lab">Lab Exam</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Rooms</label>
          <input type="number" min="1" value={form.num_rooms} onChange={e => setForm({...form, num_rooms: parseInt(e.target.value)})} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Benches per Room</label>
          <input type="number" min="1" value={form.benches_per_room} onChange={e => setForm({...form, benches_per_room: parseInt(e.target.value)})} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Seating Type</label>
          <select value={form.seating_type} onChange={e => setForm({...form, seating_type: e.target.value})} className="w-full p-3 border rounded-lg">
            <option value="single">Single Seater</option>
            <option value="double">Double Seater</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-medium">Save Exam Config</button>
      </form>
    </div>
  )
}

export default ExamSetup
