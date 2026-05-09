import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../story.css";

const API_URL = "https://darkstories-backend-1.onrender.com";

function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [capituloAEliminar, setCapituloAEliminar] = useState(null);

  /* =========================
     📥 TRAER HISTORIA
  ========================= */

  useEffect(() => {
    fetch(`${API_URL}/stories/${id}`)
      .then((res) => res.json())
      .then((data) => setStory(data))
      .catch((err) => console.error(err));
  }, [id]);

  /* =========================
     🗑️ ELIMINAR HISTORIA
  ========================= */

  const eliminarHistoria = async () => {
    const confirmar = window.confirm("¿Eliminar esta historia?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/stories/${id}`, {
        method: "DELETE",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     ✏️ EDITAR CAPÍTULO
  ========================= */

  const irAEditar = (chapterId) => {
    navigate(`/story/${id}/chapter/${chapterId}`);
  };

  /* =========================
     ➕ NUEVO CAPÍTULO
  ========================= */

  const crearNuevoCapitulo = () => {
    alert("Próximamente podrás crear capítulos");
  };

  /* =========================
     🗑️ ELIMINAR CAPÍTULO
  ========================= */

  const eliminarCapitulo = (chapterId, titulo) => {
    setCapituloAEliminar({ id: chapterId, titulo });
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    if (!capituloAEliminar) return;

    const chapterId = capituloAEliminar.id;

    setRemovingId(chapterId);

    setTimeout(async () => {
      try {
        await fetch(
          `${API_URL}/stories/${id}/chapters/${chapterId}`,
          {
            method: "DELETE",
          }
        );

        setStory((prev) => ({
          ...prev,
          chapters: prev.chapters.filter((c) => c._id !== chapterId),
        }));

        setRemovingId(null);
        setShowConfirm(false);
        setCapituloAEliminar(null);

      } catch (error) {
        console.error(error);
      }
    }, 300);
  };

  const cancelarEliminar = () => {
    setShowConfirm(false);
    setCapituloAEliminar(null);
  };

  if (!story) {
    return <p className="loading">Cargando historia...</p>;
  }

  return (
    <div className="container">

      {/* HEADER */}
      <div className="story-header">
        <h2>📖 {story.title}</h2>

        <button
          className="delete-story"
          onClick={eliminarHistoria}
        >
          🗑️
        </button>
      </div>

      {/* PORTADA */}
      {story.cover && (
        <img
          src={story.cover}
          alt="portada"
          className="story-cover"
        />
      )}

      {/* SINOPSIS */}
      <p className="story-synopsis">
        {story.synopsis}
      </p>

      {/* CAPÍTULOS */}
      <div className="chapters-list">
        {(story.chapters || []).map((c) => (
          <div
            key={c._id}
            className={`chapter-item ${
              removingId === c._id ? "removing" : ""
            }`}
          >
            <span className="chapter-title">
              📌 {c.title || "Sin título"}
            </span>

            <div className="chapter-actions">

              <button onClick={() => irAEditar(c._id)}>
                ✏️
              </button>

              <button
                onClick={() =>
                  eliminarCapitulo(c._id, c.title)
                }
              >
                🗑️
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* NUEVO CAP */}
      <button
        onClick={crearNuevoCapitulo}
        className="new-chapter"
      >
        ➕ Nuevo capítulo
      </button>

      {/* MODAL */}
      {showConfirm && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>⚠️ Eliminar capítulo</h3>

            <p>
              ¿Eliminar{" "}
              <strong>
                {capituloAEliminar?.titulo || "este capítulo"}
              </strong>
              ?
            </p>

            <div className="modal-buttons">

              <button
                className="cancel"
                onClick={cancelarEliminar}
              >
                Cancelar
              </button>

              <button
                className="confirm"
                onClick={confirmarEliminar}
              >
                Eliminar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default StoryPage;