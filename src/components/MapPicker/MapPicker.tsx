/* eslint-disable @typescript-eslint/no-explicit-any */
// MapPicker.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { MapPin, X } from 'lucide-react';
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
  GeoJSON,
} from 'react-leaflet';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onCoordinateSelect: (lat: number, lng: number) => void;
  disabled?: boolean;

  provinceGeojson?: FeatureCollection<Polygon | MultiPolygon>;
  regencyCode?: string;
  error: boolean;
}

const { BaseLayer } = LayersControl;

// Fix marker icon in bundlers
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function InvalidateSizeOnOpen({ open }: { open: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (open) setTimeout(() => map.invalidateSize(), 0);
  }, [open, map]);
  return null;
}

function ClickAndDragHandler({
  setLatLng,
}: {
  setLatLng: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Helper: fit map to GeoJSON bounds */
function FitToBounds({ geojson }: { geojson: FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (geojson) {
      const layer = L.geoJSON(geojson as any);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  }, [geojson, map]);
  return null;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onCoordinateSelect,
  disabled = false,
  provinceGeojson,
  regencyCode,
  error = false,
}) => {
  const defaultCenter = useMemo<[number, number]>(() => {
    if (provinceGeojson) {
      try {
        const bounds = L.geoJSON(provinceGeojson as any).getBounds();
        const c = bounds.getCenter();
        return [c.lat, c.lng];
      } catch {
        return [-2.5489, 104.0261]; // fallback to Sumsel center
      }
    }
    return [-2.5489, 104.0261];
  }, [provinceGeojson]);

  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState<number>(latitude ?? defaultCenter[0]);
  const [lng, setLng] = useState<number>(longitude ?? defaultCenter[1]);

  // Recenter when dialog opens
  const center = useMemo<[number, number]>(() => [lat, lng], [lat, lng]);

  // Extract selected regency feature if any
  const selectedFeature = useMemo(() => {
    if (!provinceGeojson || !regencyCode) return null;
    return provinceGeojson.features.find(
      (f: any) => f?.properties?.kddagri === regencyCode
    );
  }, [provinceGeojson, regencyCode]);

  // Build bounds target
  const boundsTarget: FeatureCollection | null = useMemo(() => {
    if (selectedFeature) {
      return {
        type: 'FeatureCollection',
        features: [selectedFeature],
      };
    }
    return provinceGeojson ?? null;
  }, [selectedFeature, provinceGeojson]);

  const handleOpen = () => {
    if (disabled) return;
    setLat(latitude ?? -2.5489);
    setLng(longitude ?? 104.0261);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const handleConfirm = () => {
    onCoordinateSelect(lat, lng);
    handleClose();
  };

  const displayText =
    latitude != null && longitude != null
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : 'Click to select location';

  // Polygon styling
  const baseStyle: L.PathOptions = {
    color: '#111827',
    weight: 1.2,
    fillOpacity: 0.15,
  };
  const highlightStyle: L.PathOptions = {
    color: '#2563eb',
    weight: 2,
    fillOpacity: 0.25,
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        disabled={disabled}
        startIcon={<MapPin size={20} />}
        fullWidth
        sx={{
          height: 56,
          borderRadius: '12px',
          textTransform: 'none',
          justifyContent: 'flex-start',
          color: disabled
            ? '#9CA3AF'
            : latitude != null && longitude != null
              ? '#374151'
              : '#9CA3AF',
          borderColor: disabled ? '#e5e7eb' : error ? '#EF4444' : '#d1d5db',
          backgroundColor: disabled ? '#f9fafb' : '#fff',
          '&:hover': {
            borderColor: disabled ? '#e5e7eb' : !error ? '#EF4444' : '#6B7280',
            backgroundColor: '#f9fafb',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: 1,
            ml: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: latitude && longitude ? 500 : 400,
              fontSize: 14,
              lineHeight: 1.2,
            }}
          >
            {displayText}
          </Typography>
          {latitude != null && longitude != null && (
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', fontSize: 12 }}
            >
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </Typography>
          )}
        </Box>
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', minHeight: 600 } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
          }}
        >
          <Box component="span" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Select Village Location
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
              Click on the map or drag the marker to select coordinates
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Selected: {lat.toFixed(6)}, {lng.toFixed(6)}
            </Typography>
          </Box>

          <Box
            sx={{
              height: 420,
              width: '100%',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <MapContainer
              center={center}
              zoom={10}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
            >
              <InvalidateSizeOnOpen open={isOpen} />
              <ClickAndDragHandler
                setLatLng={(la, ln) => {
                  setLat(la);
                  setLng(ln);
                }}
              />

              <LayersControl position="bottomright">
                <BaseLayer checked name="Google Map">
                  <TileLayer
                    attribution="Map data © OpenStreetMap contributors"
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </BaseLayer>
                <BaseLayer name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                </BaseLayer>
              </LayersControl>

              {/* Province + regency polygons */}
              {provinceGeojson && (
                <>
                  <GeoJSON
                    key={regencyCode ?? 'sumsel'}
                    data={provinceGeojson as any}
                    style={(feature: any) =>
                      feature?.properties?.kddagri === regencyCode
                        ? highlightStyle
                        : baseStyle
                    }
                    onEachFeature={(_feature, layer) => {
                      layer.on('click', () => {
                        // Cast layer to L.Polygon or L.GeoJSON to access getBounds
                        const b = (layer as L.Polygon).getBounds();
                        const c = b.getCenter();
                        setLat(c.lat);
                        setLng(c.lng);
                      });
                    }}
                  />
                  <FitToBounds geojson={boundsTarget} />
                </>
              )}

              <Marker
                position={[lat, lng]}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const p = (e.target as L.Marker).getLatLng();
                    setLat(p.lat);
                    setLng(p.lng);
                  },
                }}
              />
            </MapContainer>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none', ml: 2 }}
          >
            Select Location
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
