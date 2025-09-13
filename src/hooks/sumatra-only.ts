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

function isSouthSumatraFeature(
  f: Feature<Geometry, GeoJsonProperties>
): boolean {
  return f.properties?.provinsi === 'SUMATERA SELATAN';
}

// ✅ Only filter by province with proper types
const southSumatraOnly: G = {
  type: 'FeatureCollection',
  features: IDBoundary.features
    .map((f) => f as Feature<Geometry, GeoJsonProperties>)
    .filter(isSouthSumatraFeature),
};

export default southSumatraOnly;
