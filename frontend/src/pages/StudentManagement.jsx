import { useState, useEffect } from 'react'
import api from '../services/api'

const emptyRow = { name: '', branch: '', subject: '', exam_type: 'semester', attendance_status: 'present' }

function StudentManagement() {
  const [students, setStudents] = useState([])
  const [rows, setRows] = useState([{ ...emptyRow }])
  const [rollPrefix, setRollPrefix] = useState('ROLL')
  const [startNumber, setStartNumber] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchStudents() }, [])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students/')
      setStudents(res.data)
    } catch {
      setError('Failed to load students')
    }
  }

  const addRow = () => setRows([...rows, { ...emptyRow }])

  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))

  const updateRow = (i, field, value) => {
    const updated = [...rows]
    updated[i][field] = value
    setRows(updated)
  }

  const submitBulk = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const filled = rows.filter(r => r.name.trim() && r.branch.trim() && r.subject.trim())
    if (filled.length === 0) {
      setError('Please fill at least one student row completely.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/students/bulk', {
        students: filled,
        roll_prefix: rollPrefix,
        start_number: parseInt(startNumber),
      })
      setSuccess(`✅ Successfully added ${res.data.inserted} students! Roll numbers: ${res.data.roll_numbers.join(', ')}`)
      setRows([{ ...emptyRow }])
      fetchStudents()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add students')
    }
    setLoading(false)
  }

  const deleteStudent = async (roll) => {
    if (!confirm(`Delete student ${roll}?`)) return
    try {
      await api.delete(`/students/${roll}`)
      fetchStudents()
    } catch {
      setError('Failed to delete student')
    }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase())
  )

  const previewRolls = rows
    .filter(r => r.name.trim())
    .map((_, i) => `${rollPrefix}${String(parseInt(startNumber) + i).padStart(3, '0')}`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-indigo-800">Student Management</h2>
          <p className="text-gray-500 mt-1">Add multiple students at once with auto-generated roll numbers</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-4 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="font-bold">✕</button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg mb-4 flex justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="font-bold">✕</button>
          </div>
        )}

        {/* Bulk Add Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">BULK ADD</span>
            Add Multiple Students
          </h3>

          {/* Roll Number Config */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-indigo-50 rounded-xl">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Roll Number Prefix</label>
              <input
                value={rollPrefix}
                onChange={e => setRollPrefix(e.target.value.toUpperCase())}
                className="p-2 border-2 border-indigo-200 rounded-lg w-32 font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
                placeholder="ROLL"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Starting Number</label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={e => setStartNumber(e.target.value)}
                className="p-2 border-2 border-indigo-200 rounded-lg w-24 font-mono font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {previewRolls.length > 0 && (
              <div className="flex items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Preview Roll Numbers</label>
                  <div className="flex gap-1 flex-wrap">
                    {previewRolls.map(r => (
                      <span key={r} className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-mono">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Rows */}
          <form onSubmit={submitBulk}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <th className="p-3 text-left w-8">#</th>
                    <th className="p-3 text-left">Roll (Auto)</th>
                    <th className="p-3 text-left">Full Name *</th>
                    <th className="p-3 text-left">Branch *</th>
                    <th className="p-3 text-left">Subject *</th>
                    <th className="p-3 text-left">Exam Type</th>
                    <th className="p-3 text-left">Attendance</th>
                    <th className="p-3 text-left">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-2 text-gray-400 font-mono text-xs">{i + 1}</td>
                      <td className="p-2">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-mono text-xs font-bold">
                          {`${rollPrefix}${String(parseInt(startNumber) + i).padStart(3, '0')}`}
                        </span>
                      </td>
                      <td className="p-2">
                        <input
                          value={row.name}
                          onChange={e => updateRow(i, 'name', e.target.value)}
                          placeholder="Student name"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={row.branch}
                          onChange={e => updateRow(i, 'branch', e.target.value)}
                          placeholder="e.g. CSE"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={row.subject}
                          onChange={e => updateRow(i, 'subject', e.target.value)}
                          placeholder="e.g. Math"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.exam_type}
                          onChange={e => updateRow(i, 'exam_type', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                          <option value="semester">Semester</option>
                          <option value="mid">Mid</option>
                          <option value="group_discussion">Group Discussion</option>
                          <option value="lab">Lab</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.attendance_status}
                          onChange={e => updateRow(i, 'attendance_status', e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                      <td className="p-2">
                        {rows.length > 1 && (
                          <button type="button" onClick={() => removeRow(i)} className="text-red-500 hover:text-red-700 text-lg font-bold px-2">✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                <span className="text-xl">+</span> Add Row
              </button>
              <button
                type="button"
                onClick={() => setRows([...rows, ...Array(5).fill(null).map(() => ({ ...emptyRow }))])}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                <span className="text-xl">+</span> Add 5 Rows
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : `💾 Save ${rows.filter(r => r.name.trim()).length} Students`}
              </button>
            </div>
          </form>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              All Students
              <span className="ml-2 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">{students.length}</span>
            </h3>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, roll, branch..."
              className="p-2 border-2 border-gray-200 rounded-lg w-64 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Roll No.</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Branch</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Exam Type</th>
                  <th className="p-3 text-left">Attendance</th>
                  <th className="p-3 text-left rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      {students.length === 0 ? 'No students added yet. Use the form above to add students.' : 'No results found.'}
                    </td>
                  </tr>
                )}
                {filtered.map((s, i) => (
                  <tr key={s.roll_number} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
                    <td className="p-3 font-mono font-bold text-indigo-700">{s.roll_number}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{s.branch}</span>
                    </td>
                    <td className="p-3">{s.subject}</td>
                    <td className="p-3 capitalize">{s.exam_type.replace('_', ' ')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.attendance_status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {s.attendance_status === 'present' ? '✅ Present' : '❌ Absent'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => deleteStudent(s.roll_number)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentManagement
