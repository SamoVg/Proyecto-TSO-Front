export const API_KEY = "AIzaSyDBwPCYh27628DQ6-yCyjdN1ReV84K3tUA";
export const BASE_URL = "https://routes.googleapis.com/routes/v2:computeRouteMatrix"
export const header = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition'
    };

