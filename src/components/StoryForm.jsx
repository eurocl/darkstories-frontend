import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://darkstories-backend-1.onrender.com";

function StoryForm({ usuario }) {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [cover, setCover] = useState(null);

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

      // 🔥 FORMDATA
      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "synopsis",
        synopsis.trim()
      );

      formData.append(
        "userId",
        usuario._id
      );

      // 🔥 IMAGEN
      if (cover) {

        formData.append(
          "cover",
          cover
        );

      }

      // 🔥 DEBUG
      for (let pair of formData.entries()) {

        console.log(
          pair[0],
          pair[1]
        );

      }

      const res = await fetch(
        `${API_URL}/stories`,
        {

          method: "POST",

          body: formData,

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

        {/* PORTADA */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCover(
              e.target.files[0]
            )
          }
        />

        {/* PREVIEW */}
        {cover && (

          <img
            src={URL.createObjectURL(cover)}
            alt="preview"
            className="cover-preview"
          />

        )}

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