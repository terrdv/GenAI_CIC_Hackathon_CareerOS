import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom'


function App() {
  return (
    <div className="main-content">
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/' element={<Interview />} />
        </Routes>
    </div>
  );
}

export default App;
