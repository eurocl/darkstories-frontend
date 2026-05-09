import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import StoryPage from "./pages/StoryPage";
import Profile from "./pages/Profile";
import StoryForm from "./components/StoryForm";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userGuardado = localStorage.getItem("usuario");

    if (userGuardado) {
      setUsuario(JSON.parse(userGuardado));
    }
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="main-nav">
        <Link to="/">Inicio</Link>

        {!usuario ? (
          <>
            <Link to="/register">Registro</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/new-story">Escribir</Link>

            <Link to="/profile">
              👤 {usuario.username}
            </Link>
          </>
        )}
      </nav>

      {/* ROUTES */}
      <Routes>

        <Route
          path="/"
          element={<Home usuario={usuario} />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login setUsuario={setUsuario} />}
        />

        <Route
          path="/profile"
          element={
            <Profile
              usuario={usuario}
              setUsuario={setUsuario}
            />
          }
        />

        <Route
          path="/story/:id"
          element={<StoryPage />}
        />

        <Route
          path="/new-story"
          element={<StoryForm usuario={usuario} />}
        />

      </Routes>
    </>
  );
}

export default App;