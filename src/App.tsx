import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import RecuperarSenha from './pages/RecuperarSenha/RecuperarSenha'

import { useRouter } from './router/useRouter'

export default function App() {
    const { route, navigate } = useRouter()

    if (route === 'login')
        return <Login navigate={navigate} />

    if (route === 'cadastro')
        return <Cadastro navigate={navigate} />

    if (route === 'recuperarSenha')
        return <RecuperarSenha navigate={navigate} />

    return null
}