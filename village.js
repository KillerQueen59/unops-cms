/**
 * Node.js runner that automatically saves the generated constants to files
 * This version includes file system operations to save the output directly
 */

const fs = require('fs');
const path = require('path');

const SOUTH_SUMATRA_CODE = '16';
const BASE_URL = 'https://wilayah.id/api';

// Node.js compatible fetch (requires Node.js 18+ or install node-fetch)
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function determineVillageType(villageName, districtName, regencyName) {
  const name = villageName.toLowerCase();
  const district = districtName.toLowerCase();
  const regency = regencyName.toLowerCase();

  if (regency.includes('kota')) {
    return 'kelurahan';
  }

  const kelurahanIndicators = [
    'pusat',
    'tengah',
    'kota',
    'pasar',
    'pelabuhan',
    'stasiun',
    'terminal',
    'bandara',
    'kantor',
    'pemerintahan',
    'administrasi',
    'ilir',
    'ulu',
    'barat',
    'timur',
    'utara',
    'selatan',
    'jaya',
  ];

  if (kelurahanIndicators.some((indicator) => name.includes(indicator))) {
    return 'kelurahan';
  }

  if (kelurahanIndicators.some((indicator) => district.includes(indicator))) {
    return 'kelurahan';
  }

  return 'desa';
}

async function getAllSouthSumatraVillages() {
  console.log('🚀 Starting data collection for South Sumatra villages...\n');

  const result = {
    province: {
      code: SOUTH_SUMATRA_CODE,
      name: 'Sumatera Selatan',
    },
    regencies: [],
    allVillages: [],
    summary: {
      totalRegencies: 0,
      totalDistricts: 0,
      totalVillages: 0,
    },
  };

  try {
    console.log('📡 Fetching regencies...');
    const regenciesData = await fetchData(
      `${BASE_URL}/regencies/${SOUTH_SUMATRA_CODE}.json`
    );

    if (!regenciesData || !regenciesData.data) {
      throw new Error('Failed to fetch regencies data');
    }

    result.summary.totalRegencies = regenciesData.data.length;
    console.log(`✅ Found ${result.summary.totalRegencies} regencies\n`);

    for (const regency of regenciesData.data) {
      console.log(`🏛️  Processing regency: ${regency.name}`);

      const regencyInfo = {
        code: regency.code,
        name: regency.name,
        districts: [],
      };

      const districtsData = await fetchData(
        `${BASE_URL}/districts/${regency.code}.json`
      );
      await delay(200); // Respectful delay

      if (districtsData && districtsData.data) {
        for (const district of districtsData.data) {
          console.log(`   📍 Processing district: ${district.name}`);

          const districtInfo = {
            code: district.code,
            name: district.name,
            villages: [],
          };

          const villagesData = await fetchData(
            `${BASE_URL}/villages/${district.code}.json`
          );
          await delay(200);

          if (villagesData && villagesData.data) {
            districtInfo.villages = villagesData.data;
            result.allVillages.push(
              ...villagesData.data.map((village) => ({
                ...village,
                regencyCode: regency.code,
                regencyName: regency.name,
                districtCode: district.code,
                districtName: district.name,
              }))
            );

            result.summary.totalVillages += villagesData.data.length;
            console.log(`      🏘️  Found ${villagesData.data.length} villages`);
          }

          regencyInfo.districts.push(districtInfo);
          result.summary.totalDistricts++;
        }
      }

      result.regencies.push(regencyInfo);
      console.log(''); // Empty line for readability
    }

    return result;
  } catch (error) {
    console.error('❌ Error during data collection:', error);
    return null;
  }
}

function generateConstants(data) {
  const timestamp = new Date().toISOString();

  let output = `/**
 * South Sumatra Villages Data Constants
 * Generated on: ${timestamp}
 * Data source: https://wilayah.id/
 * 
 * Total Regencies: ${data.summary.totalRegencies}
 * Total Districts: ${data.summary.totalDistricts}
 * Total Villages: ${data.summary.totalVillages}
 */

export const villagesByRegency: Record<
  string,
  Array<{ code: string; name: string; type: 'desa' | 'kelurahan' }>
> = {
`;

  const sortedRegencies = data.regencies.sort((a, b) =>
    a.code.localeCompare(b.code)
  );

  sortedRegencies.forEach((regency, index) => {
    const regencyVillages = data.allVillages
      .filter((v) => v.regencyCode === regency.code)
      .sort((a, b) => a.code.localeCompare(b.code));

    output += `  // ${regency.name} (${regency.code})\n`;
    output += `  '${regency.code}': [\n`;

    regencyVillages.forEach((village, villageIndex) => {
      const type = determineVillageType(
        village.name,
        village.districtName,
        regency.name
      );
      const isLast = villageIndex === regencyVillages.length - 1;

      output += `    { code: '${village.code}', name: '${village.name}', type: '${type}' }${isLast ? '' : ','}\n`;
    });

    const isLastRegency = index === sortedRegencies.length - 1;
    output += `  ]${isLastRegency ? '' : ','}\n\n`;
  });

  output += `};

// Helper functions for working with the village data
export const villageHelpers = {
  // Find village by code
  findVillageByCode: (code: string) => {
    for (const regencyCode in villagesByRegency) {
      const village = villagesByRegency[regencyCode].find(v => v.code === code);
      if (village) return { ...village, regencyCode };
    }
    return null;
  },
  
  // Get all villages in a regency
  getVillagesByRegency: (regencyCode: string) => {
    return villagesByRegency[regencyCode] || [];
  },
  
  // Get all villages by type
  getVillagesByType: (type: 'desa' | 'kelurahan') => {
    const result: Array<{ code: string; name: string; type: 'desa' | 'kelurahan'; regencyCode: string }> = [];
    for (const regencyCode in villagesByRegency) {
      const villages = villagesByRegency[regencyCode]
        .filter(v => v.type === type)
        .map(v => ({ ...v, regencyCode }));
      result.push(...villages);
    }
    return result;
  },
  
  // Search villages by name (case insensitive)
  searchVillagesByName: (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    const result: Array<{ code: string; name: string; type: 'desa' | 'kelurahan'; regencyCode: string }> = [];
    
    for (const regencyCode in villagesByRegency) {
      const villages = villagesByRegency[regencyCode]
        .filter(v => v.name.toLowerCase().includes(term))
        .map(v => ({ ...v, regencyCode }));
      result.push(...villages);
    }
    return result;
  },
  
  // Get statistics
  getStatistics: () => {
    let totalVillages = 0;
    let totalDesa = 0;
    let totalKelurahan = 0;
    
    for (const regencyCode in villagesByRegency) {
      const villages = villagesByRegency[regencyCode];
      totalVillages += villages.length;
      totalDesa += villages.filter(v => v.type === 'desa').length;
      totalKelurahan += villages.filter(v => v.type === 'kelurahan').length;
    }
    
    return {
      totalVillages,
      totalDesa,
      totalKelurahan,
      totalRegencies: Object.keys(villagesByRegency).length
    };
  }
};

// Export regency codes and names for reference
export const southSumatraRegencies = {
${sortedRegencies.map((regency) => `  '${regency.code}': '${regency.name}'`).join(',\n')}
};`;

  return output;
}

// Main execution with file saving
async function main() {
  console.log('🎯 South Sumatra Villages Data Scraper');
  console.log('=======================================\n');

  const data = await getAllSouthSumatraVillages();

  if (data) {
    console.log('✅ Data collection completed!');
    console.log(
      `📊 Summary: ${data.summary.totalRegencies} regencies, ${data.summary.totalDistricts} districts, ${data.summary.totalVillages} villages\n`
    );

    console.log('📝 Generating constants file...');
    const constants = generateConstants(data);

    // Save to file
    const outputPath = path.join(__dirname, 'south-sumatra-villages.ts');

    try {
      fs.writeFileSync(outputPath, constants, 'utf8');
      console.log(`✅ File saved successfully: ${outputPath}`);

      // Also save raw data as JSON for backup
      const jsonPath = path.join(__dirname, 'south-sumatra-raw-data.json');
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`💾 Raw data backup saved: ${jsonPath}`);

      console.log('\n🎉 All done! Your files are ready to use.');
      console.log('\nFiles created:');
      console.log(`  📄 ${path.basename(outputPath)} - TypeScript constants`);
      console.log(`  📄 ${path.basename(jsonPath)} - Raw JSON data`);
    } catch (error) {
      console.error('❌ Error saving file:', error);

      // Fallback: print to console
      console.log('\n📄 Generated constants (copy and save manually):');
      console.log('=' + '='.repeat(80));
      console.log(constants);
      console.log('=' + '='.repeat(80));
    }
  } else {
    console.error('❌ Data collection failed');
    process.exit(1);
  }
}

// Run the script
main();
