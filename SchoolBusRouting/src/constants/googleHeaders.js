export const BASE_URL = "https://routes.googleapis.com/routes/v2:computeRouteMatrix"
export const API_KEY = import.meta.env.VITE_API_KEY;
export const header = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition'
    };


