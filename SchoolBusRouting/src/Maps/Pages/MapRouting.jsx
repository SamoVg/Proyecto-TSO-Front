import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Plus,
  Trash2,
  Route,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { API_KEY } from "../../constants/googleHeaders";
import { RUTA_MAT_OPT, RUTA_MAT_SINOPT, RUTA_VESP_OPT, RUTA_VESP_SINOPT } from "../../constants/rutas";

export const MapRouting = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados para los puntos en orden específico
  const [routePoints, setRoutePoints] = useState([


"Av del Paraíso 133, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Hacienda del Refugio 127, Centro de Benito Juárez, 67250 Cdad. Benito Juárez, N.L., México",
"Madre Selva 610, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Tulipán Rojo 126B, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Tulipán Rojo 154a, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Azalea 608, Centro de Benito Juárez, 67250 Cdad. Benito Juárez, N.L., México",
"Azalea 598A, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Azalea 592, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",
"Bola de Nieve 585B, Centro de Benito Juárez, 67254 Cdad. Benito Juárez, N.L., México",

"Helecho 122, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Azucena 482, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Tamarindo 148, 67254 Cdad. Benito Juárez, N.L., México",
"Eucalipto, 67254 Cdad. Benito Juárez, N.L., México",
"Azahares 391, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 403, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 336, Villas de San Jose, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Clavel 348, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",

"Av Primavera 332, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Av Primavera 330, Colinas de San Juan(Colinas de La Morena), 67254 Cdad. Benito Juárez, N.L., México",
"Lirios N, Juárez, 67250 Cdad. Benito Juárez, N.L., México"
  ]);

  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSegments, setExpandedSegments] = useState({});

  // Cargar el script de Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setIsLoaded(true);
        return;
      }

      // Remover script existente si existe
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      script.onerror = () => setError("Error al cargar Google Maps API");

      // Crear función callback global
      window.initGoogleMaps = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setError("Google Maps no se cargó correctamente");
        }
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 6,
          center: { lat: 23.6345, lng: -102.5528 }, // Centro de México
          mapTypeControl: true,
          streetViewControl: false,
        });

        const directionsServiceInstance =
          new window.google.maps.DirectionsService();
        const directionsRendererInstance =
          new window.google.maps.DirectionsRenderer({
            suppressMarkers: false,
            preserveViewport: false,
          });

        directionsRendererInstance.setMap(mapInstance);

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
      } catch (error) {
        console.error("Error inicializando Google Maps:", error);
        setError("Error al inicializar el mapa. Verifica tu API Key.");
      }
    }
  }, [isLoaded, map]);

  // Función para mostrar información de la ruta
  const displayRouteInfo = (directions) => {
    try {
      const route = directions.routes[0];
      if (!route || !route.legs) {
        setError("No se pudo obtener información de la ruta");
        return;
      }

      const legs = route.legs;
      let totalDistance = 0;
      let totalDuration = 0;
      const segmentInfo = [];

      legs.forEach((leg, index) => {
        if (!leg.distance || !leg.duration || !leg.steps) {
          console.warn(`Segmento ${index} incompleto:`, leg);
          return;
        }

        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;

        // Extraer instrucciones paso a paso para este segmento
        const instructions = leg.steps
          .map((step) => {
            if (!step.instructions || !step.distance || !step.duration) {
              return null;
            }

            return {
              instruction: step.instructions.replace(/<[^>]*>/g, ""), // Quitar HTML tags
              distance: step.distance.text|| "N/A",
              duration: step.duration.text || "N/A",
              maneuver: step.maneuver || "straight",
            };
          })
          .filter(Boolean); // Filtrar elementos null

        segmentInfo.push({
          from: routePoints[index] || "Punto desconocido",
          to: routePoints[index + 1] || "Punto desconocido",
          distance: leg.distance.text  || "N/A",
          duration: leg.duration.text || "N/A",
          startAddress: leg.start_address || "Dirección no disponible",
          endAddress: leg.end_address || "Dirección no disponible",
          instructions: instructions,
        });
      });

      setRouteInfo({
        totalDistance: (totalDistance / 1000).toFixed(1) + ' km',
        totalDuration: Math.round(totalDuration / 60 ) + ' minutos',
        segments: segmentInfo,
      });
    } catch (error) {
      console.error("Error procesando información de ruta:", error);
      setError("Error procesando la información de la ruta");
    }
  };

  // Función para calcular la ruta en orden específico
  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer) {
      setError("Servicios de Google Maps no están listos");
      return;
    }

    if (routePoints.length < 2) {
      setError("Necesitas al menos 2 puntos para crear una ruta");
      return;
    }

    // Filtrar puntos vacíos
    const validPoints = routePoints.filter(
      (point) => point && point.trim() !== ""
    );

    if (validPoints.length < 2) {
      setError("Necesitas al menos 2 puntos válidos para crear una ruta");
      return;
    }

    setLoading(true);
    setError("");
    setRouteInfo(null);

    // Configurar origen, destino y waypoints en orden
    const origin = validPoints[0];
    const destination = validPoints[validPoints.length - 1];
    const waypoints = validPoints.slice(1, -1).map((point) => ({
      location: point,
      stopover: true,
    }));

    const request = {
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: false, // NO optimizar - mantener orden
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      region: "MX",

    };

    try {
      directionsService.route(request, (result, status) => {
        setLoading(false);

        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
          displayRouteInfo(result);
        } else {
          let errorMessage = "Error al calcular la ruta";
          switch (status) {
            case "NOT_FOUND":
              errorMessage = "No se pudo encontrar una o más ubicaciones";
              break;
            case "ZERO_RESULTS":
              errorMessage = "No se encontró una ruta entre estos puntos";
              break;
            case "MAX_WAYPOINTS_EXCEEDED":
              errorMessage = "Demasiados puntos de parada (máximo 25)";
              break;
            case "INVALID_REQUEST":
              errorMessage = "Solicitud inválida. Verifica las ubicaciones";
              break;
            case "OVER_QUERY_LIMIT":
              errorMessage = "Límite de consultas excedido";
              break;
            case "REQUEST_DENIED":
              errorMessage = "Solicitud denegada. Verifica tu API Key";
              break;
            default:
              errorMessage = `Error: ${status}`;
          }
          setError(errorMessage);
        }
      });
    } catch (error) {
      setLoading(false);
      console.error("Error en calculateRoute:", error);
      setError("Error inesperado al calcular la ruta");
    }
  };

  // Agregar nuevo punto
  const addPoint = () => {
    setRoutePoints([...routePoints, ""]);
    console.log(routePoints);
  };

  // Eliminar punto
  const removePoint = (index) => {
    if (routePoints.length > 2) {
      const newPoints = routePoints.filter((_, i) => i !== index);
      setRoutePoints(newPoints);
    }
  };

  // Función para alternar expansión de segmentos
  const toggleSegmentExpansion = (segmentIndex) => {
    setExpandedSegments((prev) => ({
      ...prev,
      [segmentIndex]: !prev[segmentIndex],
    }));
  };

  // Función para obtener icono de maniobra
  const getManeuverIcon = (maneuver) => {
    const iconMap = {
      "turn-left": "↰",
      "turn-right": "↱",
      "turn-slight-left": "↖",
      "turn-slight-right": "↗",
      "turn-sharp-left": "↺",
      "turn-sharp-right": "↻",
      "uturn-left": "↶",
      "uturn-right": "↷",
      merge: "⤴",
      "fork-left": "⬅",
      "fork-right": "➡",
      ferry: "⛴",
      "roundabout-left": "↺",
      "roundabout-right": "↻",
      straight: "↑",
    };
    return iconMap[maneuver] || "→";
  };

  // Actualizar punto
  const updatePoint = (index, value) => {
    const newPoints = [...routePoints];
    newPoints[index] = value;
    setRoutePoints(newPoints);
    console.log(routePoints);
  };

 /*  const [obj, setObjt] = useState("");
  const handleJson = () => {
    const arrCiudad = routePoints.map((x) => ({ direccion: x }));
    setObjt(JSON.stringify(arrCiudad));
  }; */
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Google Maps...</p>
          <p className="text-sm text-red-500 mt-2">
            ⚠️ Necesitas reemplazar YOUR_API_KEY con tu clave real de Google
            Maps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-screen">
      <div className="flex flex-row mb-4 gap-3">
        <div className="bg-blue-600 rounded-lg text-white p-6 cursor-pointer" onClick={() => setRoutePoints(RUTA_MAT_SINOPT)}>
          Ruta Matutina sin Optimizar
        </div>
        <div className="bg-blue-600 rounded-lg text-white p-6 cursor-pointer" onClick={() => setRoutePoints(RUTA_MAT_OPT)}>
          Ruta Matutina Optimizada
        </div>
        <div className="bg-orange-400 rounded-lg text-white p-6 cursor-pointer" onClick={() => setRoutePoints(RUTA_VESP_SINOPT)}>
          Ruta Vespertina sin Optimizar
        </div>
        <div className="bg-orange-400 rounded-lg text-white p-6 cursor-pointer" onClick={() => setRoutePoints(RUTA_VESP_OPT)}>
          Ruta Matutina Optimizada
        </div>
      </div>
      <div className="mx-auto pr-2">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold flex items-center">
              <Navigation className="mr-3" />
              Ruta Secuencial A → B → C → D
            </h1>
            <p className="mt-2 opacity-90">
              Define tu ruta en el orden exacto que deseas recorrer
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 p-6 ">
            {/* Panel de control */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Botón calcular */}
                <button
                  onClick={calculateRoute}
                  disabled={loading}
                  className="w-full mb-4 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Route className="mr-2" size={16} />
                      Mostrar Ruta
                    </>
                  )}
                </button>

                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <MapPin className="mr-2" />
                  Puntos de Ruta (en orden)
                </h3>

                {/* Lista de puntos en orden */}
                <div className="space-y-3">
                  {routePoints.map((point, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => updatePoint(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Punto ${String.fromCharCode(
                            65 + index
                          )} - ${
                            index === 0
                              ? "Inicio"
                              : index === routePoints.length - 1
                              ? "Final"
                              : "Parada"
                          }`}
                        />
                        {routePoints.length > 2 && (
                          <button
                            onClick={() => removePoint(index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      {/* Flecha hacia abajo */}
                      {index < routePoints.length - 1 && (
                        <div className="flex justify-center">
                          <div className="w-0.5 h-4 bg-gray-300"></div>
                          <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 mt-3"></div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addPoint}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Agregar punto {String.fromCharCode(65 + routePoints.length)}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Mapa */}
            <div className="lg:col-span-2">
              <div
                className="bg-gray-200 rounded-lg overflow-hidden"
                style={{ height: "600px" }}
              >
                <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>

            {/* Información de la ruta */}
            {routeInfo && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-semibold text-green-800 mb-3">
                  Resumen de la Ruta
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Distancia total:</span>
                    <span className="font-semibold">
                      {routeInfo.totalDistance}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Tiempo estimado:</span>
                    <span className="font-semibold">
                      {routeInfo.totalDuration}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold text-green-800 mb-2">
                    Segmentos de Ruta:
                  </h5>
                  <div className="space-y-3">
                    {routeInfo.segments.map((segment, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border overflow-hidden"
                      >
                        {/* Header del segmento */}
                        <div
                          className="p-3 bg-blue-50 border-b cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => toggleSegmentExpansion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-blue-600">
                                {String.fromCharCode(65 + index)} →{" "}
                                {String.fromCharCode(65 + index + 1)}
                              </span>
                              <span className="text-sm text-gray-600">
                                {segment.distance} • {segment.duration}
                              </span>
                            </div>
                            {expandedSegments[index] ? (
                              <ChevronDown
                                size={16}
                                className="text-blue-600"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                className="text-blue-600"
                              />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {segment.from} → {segment.to}
                          </div>
                        </div>

                        {/* Instrucciones detalladas */}
                        {expandedSegments[index] && (
                          <div className="p-3">
                            <div className="text-xs text-gray-500 mb-2">
                              <div>
                                <strong>Desde:</strong> {segment.startAddress}
                              </div>
                              <div>
                                <strong>Hasta:</strong> {segment.endAddress}
                              </div>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              <h6 className="font-semibold text-gray-700 text-sm">
                                Instrucciones paso a paso:
                              </h6>
                              {segment.instructions.map(
                                (instruction, stepIndex) => (
                                  <div
                                    key={stepIndex}
                                    className="flex items-start space-x-2 p-2 bg-gray-50 rounded text-xs"
                                  >
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                      {stepIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-1 mb-1">
                                        <span className="text-lg">
                                          {getManeuverIcon(
                                            instruction.maneuver
                                          )}
                                        </span>
                                        <span className="text-gray-600">
                                          {instruction.distance} •{" "}
                                          {instruction.duration}
                                        </span>
                                      </div>
                                      <div className="text-gray-800">
                                        {instruction.instruction}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
