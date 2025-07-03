import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// Modal para eliminar niños 
const ConfirmModal = ({ isOpen, onConfirm, onCancel, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-4">Confirmar Eliminación</h3>
        <p className="mb-6">
          ¿Estás seguro que deseas eliminar a <span className="font-semibold">{studentName}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Dropdown para mostrar detalles
const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-blue-800 font-medium">{label}:</span>
    <p className="text-gray-700">{value}</p>
  </div>
);

export const DataScreen = () => {
  const [students, setStudents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar datos iniciales desde localStorage
  useEffect(() => {
    const loadStudents = () => {
      try {
        const savedStudents = localStorage.getItem('schoolTransportStudents');
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        } else {
          // Datos de ejemplo iniciales si no hay nada guardado
          const exampleStudents = [
            {
              id: 1,
              name: 'Alan Vega',
              calle: 'Flor de Belén',
              numero: '431',
              colonia: 'Colinas de San Juan',
            },
            {
              id: 2,
              name: 'Brandon Escobedo',
              calle: 'Flor de Belén',
              numero: '473',
              colonia: 'Colinas de San Juan',
            }
          ];
          setStudents(exampleStudents);
          localStorage.setItem('schoolTransportStudents', JSON.stringify(exampleStudents));
        }
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDeleteClick = (id, name) => {
    setStudentToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedStudents = students.filter(student => student.id !== studentToDelete.id);
    setStudents(updatedStudents);
    localStorage.setItem('schoolTransportStudents', JSON.stringify(updatedStudents));
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleAddNew = () => {
    navigate('/agregar-estudiante');
  };

  const handleEdit = (id) => {
    navigate(`/editar-estudiante/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        studentName={studentToDelete?.name || ''}
      />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-100 overflow-hidden">
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

        <div className="divide-y divide-gray-200">
          {students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay estudiantes registrados
            </div>
          ) : (
            students.map(student => (
              <div key={student.id} className="group">
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
                        handleEdit(student.id);
                      }}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(student.id, student.name);
                      }}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {expandedId === student.id && (
                  <div className="p-4 bg-blue-50 grid grid-cols-2 gap-4">
                    <DetailItem label="Calle" value={student.calle} />
                    <DetailItem label="Número" value={student.numero} />
                    <DetailItem label="Colonia" value={student.colonia} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleAddNew}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            + Agregar Nuevo Estudiante
          </button>
        </div>
      </div>
    </div>
  );
};