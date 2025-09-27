import { Routes, Route, Link } from 'react-router-dom'
import CreateJourney from './pages/CreateJourney'
import JourneyDetails from './pages/JourneyDetails'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem'
          }}>
            <h1>What I Bought You</h1>
            <Link to="/create">
              <button>Create New Journey</button>
            </Link>
          </div>
        } />
        <Route path="/create" element={<CreateJourney />} />
        <Route path="/journeys/:id" element={<JourneyDetails />} />
      </Routes>
    </div>
  )
}

export default App