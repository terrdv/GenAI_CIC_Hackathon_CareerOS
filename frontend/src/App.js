import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Login from './pages/Login';

function App() {
  return (
    <div className="main-content">
        <Routes>
            <Route path='/pages/Dashboard' element={<Dashboard />} />
            <Route path='/pages/Interview' element={<Interview />} />
            <Route path='/pages/Login' element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
