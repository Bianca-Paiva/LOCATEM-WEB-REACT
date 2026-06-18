import { useState, useEffect } from 'react'

export type Route =
    | 'home'
    | 'login'
    | 'cadastro'
    | 'recuperarSenha'

function getRouteFromHash(): Route {
    const hash = window.location.hash.replace('#', '')

    if (hash === 'login') return 'login'
    if (hash === 'cadastro') return 'cadastro'
    if (hash === 'recuperarSenha') return 'recuperarSenha'

    return 'login'
}

export function useRouter() {
    const [route, setRoute] = useState<Route>(getRouteFromHash)

    useEffect(() => {
        const onHashChange = () => {
            setRoute(getRouteFromHash())
        }

        window.addEventListener('hashchange', onHashChange)

        return () => {
            window.removeEventListener('hashchange', onHashChange)
        }
    }, [])

    const navigate = (to: Route) => {
        window.location.hash = to
    }

    return { route, navigate }
}