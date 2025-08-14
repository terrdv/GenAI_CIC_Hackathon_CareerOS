import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';


function App() {
  return (
    <div>
        <div className="main-content">

            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/interview' element={<Interview />} />
                <Route path='/login' element={<Login/>} />
            </Routes>
        </div>

    </div>
    
  );
}

export default App;
