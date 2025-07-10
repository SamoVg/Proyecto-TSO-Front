import React, { useState, useEffect, useCallback } from 'react';
import { API_KEY } from '../../constants/googleHeaders';

// Hook personalizado para manejar Google Maps API
const useGoogleMaps = (apiKey) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Error al cargar Google Maps API');
    
    document.head.appendChild(script);

    return () => {
      // Cleanup si el componente se desmonta
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [apiKey]);

  return { isLoaded, error };
};

// Hook para obtener coordenadas de lugares
const usePlacesCoordinates = (apiKey) => {
  const { isLoaded, error: apiError } = useGoogleMaps(apiKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const buscarLugar = useCallback((nombreLugar) => {
    return new Promise((resolve) => {
      if (!window.google || !window.google.maps) {
        resolve({
          nombre: nombreLugar,
          error: 'Google Maps API no está cargada',
          exito: false
        });
        return;
      }

      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        query: nombreLugar,
        fields: ['name', 'geometry', 'formatted_address', 'place_id']
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
          const lugar = results[0];
          resolve({
            nombre: nombreLugar,
            nombreEncontrado: lugar.name,
            coordenadas: {
              lat: lugar.geometry.location.lat(),
              lng: lugar.geometry.location.lng()
            },
            direccion: lugar.formatted_address,
            placeId: lugar.place_id,
            exito: true
          });
        } else {
          resolve({
            nombre: nombreLugar,
            error: `No se encontró el lugar: ${nombreLugar}`,
            exito: false
          });
        }
      });
    });
  }, []);

  const obtenerCoordenadasDeLugares = useCallback(async (lugares) => {
    if (!isLoaded) {
      setError('Google Maps API no está cargada');
      return [];
    }

    setLoading(true);
    setError(null);
    
    try {
      const resultados = [];
      
      for (const lugar of lugares) {
        const resultado = await buscarLugar(lugar);
        resultados.push(resultado);
      }
      
      setResults(resultados);
      return resultados;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isLoaded, buscarLugar]);

  return {
    obtenerCoordenadasDeLugares,
    loading,
    error: error || apiError,
    results,
    isApiLoaded: isLoaded
  };
};

// Componente de ejemplo
const PlacesCoordinates = () => {
 
  const { obtenerCoordenadasDeLugares, loading, error, results, isApiLoaded } = usePlacesCoordinates(API_KEY);
  
  const [lugares, setLugares] = useState([

"Av del Paraíso 133, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 348, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 336, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Av Primavera 332, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Av Primavera 330, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Hacienda del Refugio 127, Centro de Benito Juárez, 67250 Cdad. Benito Juárez, N.L., México",
"Madre Selva 610, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Tulipán Rojo 126B, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Azalea 608, Centro de Benito Juárez, 67250 Cdad. Benito Juárez, N.L., México",
"Azalea 598A, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Azalea 592, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Tulipán Rojo 154a, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Bola de Nieve 585B, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Helecho 122, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Azucena 482, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 403, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Azahares 391, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Tamarindo 148, 67254 Cdad. Benito Juárez, N.L., México",
"Eucalipto, 67254 Cdad. Benito Juárez, N.L., México",
"Lirios N, Juárez, 67250 Cdad. Benito Juárez, N.L., México"
  ]);
  const [nuevoLugar, setNuevoLugar] = useState('');

  const handleBuscarCoordenadas = async () => {
    if (lugares.length === 0) return;
    await obtenerCoordenadasDeLugares(lugares);
  };

  const agregarLugar = () => {
    if (nuevoLugar.trim() && !lugares.includes(nuevoLugar)) {
      setLugares([...lugares, nuevoLugar]);
      setNuevoLugar('');
    }
  };

  const eliminarLugar = (index) => {
    setLugares(lugares.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Buscador de Coordenadas</h1>
      
      {/* Estado de la API */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          isApiLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isApiLoaded ? 'API Cargada' : 'Cargando API...'}
        </span>
      </div>

      {/* Agregar lugar */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevoLugar}
            onChange={(e) => setNuevoLugar(e.target.value)}
            placeholder="Agregar nuevo lugar..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && agregarLugar()}
          />
          <button
            onClick={agregarLugar}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Agregar
          </button>
        </div>

        {/* Lista de lugares */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lugares.map((lugar, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {lugar}
              <button
                onClick={() => eliminarLugar(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleBuscarCoordenadas}
          disabled={!isApiLoaded || loading || lugares.length === 0}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar Coordenadas'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Resultados:</h2>
          {results.map((lugar, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                lugar.exito 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">{lugar.nombre}</h3>
              {lugar.exito ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nombre encontrado:</strong> {lugar.nombreEncontrado}</p>
                  <p><strong>Coordenadas:</strong> {lugar.coordenadas.lat}, {lugar.coordenadas.lng}</p>
                  <p><strong>Dirección:</strong> {lugar.direccion}</p>
                  <p><strong>Place ID:</strong> {lugar.placeId}</p>
                </div>
              ) : (
                <p className="text-red-600">{lugar.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacesCoordinates;