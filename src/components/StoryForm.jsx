import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://darkstories-backend-1.onrender.com";

function StoryForm({ usuario }) {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // 🔒 SIN LOGIN
  if (!usuario) {

    return (

      <div className="story-form-page">

        <div className="story-form-card">

          <h2>🔒 Debes iniciar sesión</h2>

          <p>
            Necesitas una cuenta para publicar historias.
          </p>

          <div className="auth-buttons">

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Registro
            </Link>

          </div>

        </div>

      </div>

    );
  }

  // 🔥 CREAR HISTORIA
  const crearHistoria = async (e) => {

    e.preventDefault();

    setError("");

    console.log("TITLE:", title);

    // VALIDACIÓN
    if (!title.trim()) {

      setError("El título es obligatorio");

      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${API_URL}/stories`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            title: title.trim(),

            synopsis: synopsis.trim(),

            userId: usuario._id,

          }),

        }
      );

      const data = await res.json();

      console.log("RESPONSE:", data);

      if (!res.ok) {

        setError(
          data.error || "Error al crear historia"
        );

        return;
      }

      // 🔥 IR A STORY
      navigate(`/story/${data._id}`);

    } catch (err) {

      console.log(err);

      setError("No se pudo conectar");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="story-form-page">

      <form
        className="story-form-card"
        onSubmit={crearHistoria}
      >

        <h2>
          ✍️ Crear nueva historia
        </h2>

        {/* TÍTULO */}
        <input
          type="text"
          placeholder="Título de la historia"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* DEBUG */}
        <p>{title}</p>

        {/* SINOPSIS */}
        <textarea
          placeholder="Escribe una sinopsis..."
          value={synopsis}
          onChange={(e) =>
            setSynopsis(e.target.value)
          }
        />

        {/* ERROR */}
        {error && (

          <p className="form-error">
            {error}
          </p>

        )}

        <button
          type="submit"
          disabled={loading}
          className="publish-button"
        >

          {loading
            ? "Publicando..."
            : "Publicar historia"}

        </button>

      </form>

    </div>
  );
}

export default StoryForm;