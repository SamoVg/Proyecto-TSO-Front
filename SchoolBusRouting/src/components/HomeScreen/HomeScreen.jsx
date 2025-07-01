import { useNavigate } from "react-router";

export const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-xl shadow-blue-100">
        {/* Logo y Título */}
        <div className="mb-6">
          <div className="text-5xl mb-4">🚌</div>
          <h1 className="text-2xl font-bold text-blue-800">
            Transportes Escolares <span className="text-yellow-500">ABC</span>
          </h1>
          <p className="text-gray-700 opacity-80 mt-2">
            Llevamos a los niños con seguridad y puntualidad
          </p>
        </div>

        {/* Botones con navegación */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate("/maps")}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-blue-800 text-white font-semibold rounded-xl hover:-translate-y-1 hover:shadow-md hover:shadow-blue-200 transition-all"
          >
            <span>📍</span> Mostrar Ruta
          </button>
          <button 
            onClick={() => navigate("/data")}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white text-blue-800 font-semibold border-2 border-blue-800 rounded-xl hover:-translate-y-1 hover:shadow-md hover:shadow-blue-200 transition-all"
          >
            <span>👦</span> Datos de Niños
          </button>
        </div>
      </div>
    </div>
  );
};