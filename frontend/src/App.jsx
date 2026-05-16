import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StagiairesList from './pages/Stagiaires/StagiairesList';

import PresencesList from './pages/Presences/PresencesList';
import NotesList from './pages/Notes/NotesList';

import StagesList from './pages/Stages/StagesList';
import Settings from './pages/Settings/Settings';
import Assignments from './pages/Admin/Assignments';
import Documents from './pages/Admin/Documents';

// Composant placeholder pour les pages en cours de développement
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>Cette page est en cours de développement.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Routes protégées */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Pages à créer ensuite */}
        <Route path="/stagiaires" element={<StagiairesList />} />
        <Route path="/notes" element={<NotesList />} />
        <Route path="/presences" element={<PresencesList />} />
        <Route path="/stages" element={<StagesList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/assignments" element={<Assignments />} />
        <Route path="/admin/documents" element={<Documents />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
