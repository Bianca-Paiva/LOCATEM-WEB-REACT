import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import { Home } from './pages/Home/Home';
import './styles/global.css';

// Criamos um mini wrapper para injetar o navigate que suas telas antigas esperam
const LoginWrapper = () => {
  const navigate = useNavigate();
  // Transforma o fluxo de rota em string como seu código antigo lia
  const handleNavigate = (route: string) => navigate(`/${route}`);
  return <Login navigate={handleNavigate} />;
};

const CadastroWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => navigate(`/${route}`);
  return <Cadastro navigate={handleNavigate} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Usamos os wrappers temporários para aceitar seu código atual sem erros */}
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/cadastro" element={<CadastroWrapper />} />
        
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}