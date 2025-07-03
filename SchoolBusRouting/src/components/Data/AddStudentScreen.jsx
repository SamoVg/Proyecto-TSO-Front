import { useState } from 'react';
import { useNavigate } from 'react-router';

export const AddStudentScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    calle: '',
    numero: '',
    colonia: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedStudents = JSON.parse(localStorage.getItem('schoolTransportStudents') || '[]');
    const newId = savedStudents.length > 0 ? Math.max(...savedStudents.map(s => s.id)) + 1 : 1;
    
    const newStudent = {
      id: newId,
      ...formData
    };

    const updatedStudents = [...savedStudents, newStudent];
    localStorage.setItem('schoolTransportStudents', JSON.stringify(updatedStudents));
    navigate('/data');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-100 overflow-hidden">
        <div className="bg-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <button 
              onClick={() => navigate('/data')} 
              className="text-white hover:text-yellow-300 transition-colors"
            >
              ←
            </button>
            Agregar Nuevo Estudiante
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
              <input
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
              <input
                type="text"
                name="colonia"
                value={formData.colonia}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/data')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};