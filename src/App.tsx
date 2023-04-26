import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { Game } from './pages/Game'
import { Login } from './pages/Login'
import { Spring } from './pages/Spring'

const router = createBrowserRouter([{
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
}, {
  path: "/spring",
  element: <Spring />
}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
