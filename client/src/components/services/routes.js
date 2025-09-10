import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from '../auth/AuthPage'; // adjust path as needed
import Dashboard from '../dashboard/Dashboard'; // adjust path as needed

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;