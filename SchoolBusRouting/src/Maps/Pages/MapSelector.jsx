import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader, Navigation } from "lucide-react";
import { API_KEY } from "../../constants/googleHeaders";

export const MapSelector = () => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Refs for Google Places services
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const geocoder = useRef(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeServices();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeServices;
      script.onerror = () => {
        setError("Failed to load Google Maps API. Please check your API key.");
      };

      document.head.appendChild(script);
    };

    const initializeServices = () => {
      if (window.google && window.google.maps) {
        // Initialize Google Places services
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();

        // Create a dummy div for PlacesService (required by Google)
        const dummyDiv = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );

        geocoder.current = new window.google.maps.Geocoder();

        setIsGoogleLoaded(true);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  // Debounce function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.length > 2 && isGoogleLoaded) {
        searchPlaces(input);
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input, isGoogleLoaded]);

  // Search for places using Google Places Autocomplete
  const searchPlaces = (searchText) => {
    if (!autocompleteService.current) return;

    setLoading(true);
    setError("");

    const request = {
      input: searchText,
      componentRestrictions: { country: "mx" },
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        setLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions || []);
        } else if (
          status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          setPredictions([]);
        } else {
          setError("Error fetching suggestions. Please try again.");
          setPredictions([]);
        }
      }
    );
  };

  // Get place details when user selects a prediction
  const handlePlaceSelect = (prediction) => {
    if (!placesService.current) return;

    setLoading(true);
    setPredictions([]);
    setInput("");

    const request = {
      placeId: prediction.place_id,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "address_components",
        "place_id",
        "types",
        "url",
      ],
    };

    placesService.current.getDetails(request, (place, status) => {
      setLoading(false);

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const placeDetails = {
          place_id: place.place_id,
          name: place.name,
          formatted_address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          address_components: place.address_components,
          types: place.types,
          google_maps_url: place.url,
        };

        setSelectedPlace(placeDetails);
      } else {
        setError("Error getting place details. Please try again.");
      }
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address
        if (geocoder.current) {
          const latlng = { lat: latitude, lng: longitude };

          geocoder.current.geocode({ location: latlng }, (results, status) => {
            setLoading(false);

            if (status === "OK" && results[0]) {
              const place = results[0];
              setInput("");
              setSelectedPlace({
                place_id: place.place_id,
                name: "Current Location",
                formatted_address: place.formatted_address,
                coordinates: { lat: latitude, lng: longitude },
                address_components: place.address_components,
                types: place.types,
              });
            } else {
              setError("No pudimos obtener tu ubicacion.");
            }
          });
        }
      },
      (error) => {
        setLoading(false);
        setError("Unable to retrieve your location." + error);
      }
    );
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setSelectedPlace(null);
  };

  

  // Extract specific address components
  const getAddressComponent = (components, type) => {
    const component = components?.find((comp) => comp.types.includes(type));
    return component ? component.long_name : "";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Seleccione una direccion
      </h2>

      {!isGoogleLoaded && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Cargando Direcciones...
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ingrese su direccion..."
          disabled={!isGoogleLoaded}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={!isGoogleLoaded || loading}
        className="mb-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Navigation className="h-4 w-4 mr-2" />
        Usar la Ubicacion Actual
      </button>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Predictions */}
      {predictions.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              onClick={() => handlePlaceSelect(prediction)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0 flex items-start"
            >
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {prediction.structured_formatting?.main_text ||
                    prediction.description}
                </div>
                <div className="text-xs text-gray-500">
                  {prediction.structured_formatting?.secondary_text || ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Place Details */}
      {selectedPlace && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold mb-3 text-green-800">
            Selected Place:
          </h3>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-green-800">Name:</span>
              <span className="text-green-700 ml-2">{selectedPlace.name}</span>
            </div>

            <div>
              <span className="font-medium text-green-800">Address:</span>
              <span className="text-green-700 ml-2">
                {selectedPlace.formatted_address}
              </span>
            </div>

            <div>
              <span className="font-medium text-green-800">Coordinates:</span>
              <span className="text-green-700 ml-2">
                {selectedPlace.coordinates.lat.toFixed(6)},{" "}
                {selectedPlace.coordinates.lng.toFixed(6)}
              </span>
            </div>

            {selectedPlace.address_components && (
              <div className="mt-3 p-3 bg-white rounded border">
                <h4 className="font-medium text-green-800 mb-2">
                  Address Components:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Calle:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "route"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Numero:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "street_number"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Ciudad:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "locality"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "administrative_area_level_1"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Pais:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "country"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Codigo Postal:</span>
                    <span className="ml-1">
                      {getAddressComponent(
                        selectedPlace.address_components,
                        "postal_code"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <span className="font-medium text-green-800">Place ID:</span>
              <span className="text-green-700 ml-2 text-xs break-all">
                {selectedPlace.place_id}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
