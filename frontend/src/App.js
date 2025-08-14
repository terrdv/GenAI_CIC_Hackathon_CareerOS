import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Login from './pages/Login';
import Layout from './components/Layout';
import ResumeAnalysis from './pages/ResumeAnalysis';

function App() {
  return (
    <div>
        <div className="main-content">
            <Routes>
                <Route path='/' element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } />
                <Route path='/interview' element={
                  <Layout>
                    <Interview />
                  </Layout>
                } />
                <Route path='/resume-analysis' element={
                  <Layout>
                    <ResumeAnalysis />
                  </Layout>
                } />
                <Route path='/login' element={<Login/>} />
            </Routes>
        </div>
    </div>
    
  );
}

export default App;
