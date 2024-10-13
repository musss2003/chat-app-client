import { Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Messages from './components/Messages';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const App = () => {
    return (
        <Routes>
          <Route path="/messages" element={<ProtectedRoute element={Messages} />} />
          <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
    );
};

export default App;

