import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import StudentManagement from './pages/StudentManagement'
import ExamSetup from './pages/ExamSetup'
import SeatingView from './pages/SeatingView'
import WeatherWidget from './pages/WeatherWidget'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Exam Hall Allocation</h1>
            <div className="space-x-4">
              <Link to="/" className="text-white hover:text-blue-200">Dashboard</Link>
              <Link to="/students" className="text-white hover:text-blue-200">Students</Link>
              <Link to="/setup" className="text-white hover:text-blue-200">Exam Setup</Link>
              <Link to="/seating" className="text-white hover:text-blue-200">Seating</Link>
              <Link to="/weather" className="text-white hover:text-blue-200">Weather</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/setup" element={<ExamSetup />} />
          <Route path="/seating" element={<SeatingView />} />
          <Route path="/weather" element={<WeatherWidget />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
