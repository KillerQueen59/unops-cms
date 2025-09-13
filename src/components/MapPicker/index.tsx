import dynamic from 'next/dynamic';

// Dynamically import MapPicker without SSR
export const MapPicker = dynamic(
  () => import('./MapPicker').then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => <div style={{ height: 420 }}>Loading map...</div>,
  }
);

export default MapPicker;
