import requests
import json

API_KEY = "AIzaSyDBwPCYh27628DQ6-yCyjdN1ReV84K3tUA"

url = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix"
headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status"

}
body = {
    "origins": [
        {"waypoint": {"address": "Cto. Hacienda de Xalapa 397, Ex Hacienda El Rosario, 67288 Jardines de la Silla, N.L., México"}}
    ],
    "destinations": [
        {"waypoint": {"address": "Comunicaciones 225, S.C.O.P., 67190 Guadalupe, N.L., México"}}
    ],
    "travelMode": "DRIVE",
    "routingPreference": "TRAFFIC_AWARE"
}

resp = requests.post(url, headers=headers, json=body)
resp.raise_for_status()
matrix = resp.json()

print(matrix)