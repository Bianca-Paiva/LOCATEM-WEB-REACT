import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
import RecuperarSenha from './pages/RecuperarSenha/InformeEmail/InformeEmail'
import InformeToken from './pages/RecuperarSenha/InformeToken/InformeToken'

import { useRouter } from './router/useRouter'

export default function App() {
    const { route, navigate } = useRouter()

    if (route === 'login')
        return <Login navigate={navigate} />

    if (route === 'cadastro')
        return <Cadastro navigate={navigate} />

    if (route === 'recuperarSenha')
        return <RecuperarSenha navigate={navigate} />

    if (route === 'informeToken')
        return <InformeToken navigate={navigate} />

    return null
}