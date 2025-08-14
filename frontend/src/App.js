import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import ResumeAnalysis from './pages/ResumeAnalysis';
import Login from './pages/Login';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/interview' element={<Interview />} />
                <Route path='/resume-analysis' element={<ResumeAnalysis />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </Layout>
    );
}

export default App;