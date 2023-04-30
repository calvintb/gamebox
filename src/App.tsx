import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { Game } from './pages/Game'
import { Login } from './pages/Login'

const router = createHashRouter([{
  path: "/",
  element: <Home />
}, {
  path: "/signup",
  element: <SignUp />
}, {
  path: "/game",
  element: <Game />
}, {
  path: "/login",
  element: <Login />
}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
