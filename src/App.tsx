import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { Game } from './pages/Game'
import { Login } from './pages/Login'

const router = createBrowserRouter([{
  path: "/",
  element: <Home />
}, {
  path: "/signup",
  element: <SignUp />
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
