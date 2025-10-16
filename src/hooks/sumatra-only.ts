// southSumatraOnly.ts
import { IDBoundary } from '@/components/IDBoundary';
import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from 'geojson';

type Geometry = Polygon | MultiPolygon;
type G = FeatureCollection<Geometry>;

// ✅ Only filter by province with proper types
const southSumatraOnly: G = {
  type: 'FeatureCollection',
  features: IDBoundary.features.map(
    (f) => f as Feature<Geometry, GeoJsonProperties>
  ),
};

export default southSumatraOnly;
