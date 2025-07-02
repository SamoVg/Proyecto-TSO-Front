import { useState } from 'react';
import { useNavigate } from 'react-router';

// Datos de ejemplo (estos luego los quitan para poner los reales XD)
const initialStudents = [
  {
    id: 1,
    name: 'Alan Vega',
    grade: '5°',
    group: 'B',
    allergies: 'Ninguna',
    contact: '8112345678',
    teacher: 'Roberto De La Riva'
  },
  {
    id: 2,
    name: 'Brandon Escobedo',
    grade: '4°',
    group: 'A',
    allergies: 'Penicilina',
    contact: '1122334455',
    teacher: 'Esteban Méndez Alfaro'
  }
];

export const DataScreen = () => {
  const [students, setStudents] = useState(initialStudents);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
    // Llamada a API para eliminar estudiantes (later), por ahora solo es un ejemplo de que pasaría si le pican a "Eliminar".
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:text-yellow-300 transition-colors"
            >
              ←
            </button>
            Datos de los Niños
          </h1>
          <p className="opacity-90">Administra la información de los niños</p>
        </div>

        {/* Lista de estudiantes */}
        <div className="divide-y divide-gray-200">
          {students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay estudiantes registrados
            </div>
          ) : (
            students.map(student => (
              <div key={student.id} className="group">
                {/* Encabezado del desplegable */}
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => toggleExpand(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`transform transition-transform ${expandedId === student.id ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <span className="font-medium text-blue-800">{student.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí iría la navegación a edición
                        console.log('Editar:', student.id);
                      }}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(student.id);
                      }}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Contenido desplegable */}
                {expandedId === student.id && (
                  <div className="p-4 bg-blue-50 grid grid-cols-2 gap-4">
                    <DetailItem label="Grado" value={student.grade} />
                    <DetailItem label="Grupo" value={student.group} />
                    <DetailItem label="Alergias" value={student.allergies} />
                    <DetailItem label="Contacto" value={student.contact} />
                    <DetailItem label="Maestro" value={student.teacher} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* "Botón de Nuevo Estudiante" */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => console.log('Agregar nuevo estudiante')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            + Agregar Nuevo Estudiante
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-blue-800 font-medium">{label}:</span>
    <p className="text-gray-700">{value}</p>
  </div>
);