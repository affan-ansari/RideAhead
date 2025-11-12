const API_KEY = '081153d1319a43f7968615000c24eb0e';

export type CoordinateType = {
  latitude: number;
  longitude: number;
};

export type RouteData = {
  features: Feature[];
};

export type Feature = {
  geometry: Geometry;
};

export type Geometry = {
  type: string;
  coordinates: number[][][];
};

export type FormattedCoordinate = {
  latitude: number;
  longitude: number;
};

export type RouteResult = {
  formattedCoordinates: FormattedCoordinate[];
  startPoint: FormattedCoordinate;
  endPoint: FormattedCoordinate;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const getRoute = async (
  startingPoint: CoordinateType,
  endingPoint: CoordinateType,
): Promise<RouteResult> => {
  const requestOptions: RequestInit = {
    method: 'GET',
  };

  const response = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${startingPoint.latitude.toString()}%2C${startingPoint.longitude.toString()}%7C${endingPoint.latitude.toString()}%2C${endingPoint.longitude.toString()}&mode=drive&apiKey=${API_KEY}`,
    requestOptions,
  );
  const routeData: RouteData = await response.json();
  console.log(routeData);

  const feature: Feature = routeData.features[0];
  const coordinates: number[][] = feature.geometry.coordinates[0];

  // Convert GeoJSON format [longitude, latitude] to React Native Maps format {latitude, longitude}
  const formattedCoordinates: FormattedCoordinate[] = coordinates.map(
    (coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }),
  );

  // Set start and end points
  const startPoint: FormattedCoordinate = {
    latitude: formattedCoordinates[0].latitude,
    longitude: formattedCoordinates[0].longitude,
  };

  const endPoint: FormattedCoordinate = {
    latitude: formattedCoordinates[formattedCoordinates.length - 1].latitude,
    longitude: formattedCoordinates[formattedCoordinates.length - 1].longitude,
  };

  return { formattedCoordinates, startPoint, endPoint };
};
