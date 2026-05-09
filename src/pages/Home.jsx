import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://darkstories-backend-1.onrender.com";

function Home({ usuario }) {

  const [historias, setHistorias] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    fetch(`${API_URL}/stories`)
      .then((res) => res.json())
      .then((data) =>
        setHistorias(Array.isArray(data) ? data : [])
      )
      .catch((err) => console.log(err));

  }, []);

  return (
    <>
      {/* HERO */}
      <div className="home-banner">

        <img src="/banner.jpg" alt="banner" />

        <div className="banner-overlay"></div>

        <div className="hero-content">

          <h1>UMBRAL SEER</h1>

          <p>
            Dark stories • forgotten places • hidden memories
          </p>

          {!usuario ? (

            <div className="auth-message">

              <p>
                🔒 Debes iniciar sesión para escribir historias
              </p>

              <div className="auth-buttons">

                <Link to="/login">
                  Iniciar sesión
                </Link>

                <Link to="/register">
                  Registro
                </Link>

              </div>

            </div>

          ) : (

            <div className="auth-message">

              <p>
                Bienvenido, {usuario.username}
              </p>

            </div>

          )}

        </div>

      </div>

      {/* STORIES */}
      <section className="stories-section container">

        {historias.map((h, index) => (

          <div
            key={h._id}
            className={`editorial-card ${
              index % 2 !== 0 ? "reverse" : ""
            }`}
          >

            {/* IMAGEN */}
            <div className="editorial-image">

              <img
                src={
                  h.cover ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                }
                alt={h.title}
              />

            </div>

            {/* TEXTO */}
            <div className="editorial-content">

              <div className="editorial-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h2>
                {h.title || "Sin título"}
              </h2>

              <div className="editorial-line"></div>

              <p>
                {h.synopsis ||
                  "Una historia oscura perdida entre recuerdos olvidados."}
              </p>

              <button
                className="read-button"
                onClick={() => navigate(`/story/${h._id}`)}
              >
                Leer historia
              </button>

            </div>

          </div>

        ))}

      </section>
    </>
  );
}

export default Home;