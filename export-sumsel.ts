import { writeFileSync } from 'fs';
import southSumatraOnly from '@/hooks/sumatra-only';

writeFileSync(
  'sumatera-selatan-only.geojson',
  JSON.stringify(southSumatraOnly)
);
console.log('Wrote sumatera-selatan-only.geojson');
