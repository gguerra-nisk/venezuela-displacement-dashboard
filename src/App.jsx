import React, { useState, useMemo } from 'react';

// All targets from revised spreadsheet + urban unrest locations
// Population for Libertador corrected to 256,565 per user input
const TARGETS_DATA = [
  // === AIR BASES (9) ===
  { name: "Rafael Urdaneta Air Base", municipality: "Maracaibo", state: "Zulia", population: 1459448, type: "Air Base", region: "West", coast: "Coastal", urban: "Major Metro", notes: "OV-10 Broncos, counter-insurgency/anti-drug operations" },
  { name: "Lt. Vicente Landaeta Gil Air Base", municipality: "Iribarren (Barquisimeto)", state: "Lara", population: 996230, type: "Air Base", region: "West", coast: "Interior", urban: "Major Metro", notes: "VF-5 fighters upgraded to Grifo standard" },
  { name: "Lt. Col. Luis Apolinar Mendez AFB", municipality: "Caroni (Puerto Ordaz)", state: "Bolivar", population: 672651, type: "Air Base", region: "East", coast: "Interior", urban: "Major Metro", notes: "Regular air force deployments, Ciudad Guayana" },
  { name: "Mariscal Sucre Air Base", municipality: "Girardot (Maracay)", state: "Aragua", population: 401294, type: "Air Base", region: "Central", coast: "Near-Coastal", urban: "Urban", notes: "Air Force Academy, F260EU, T-27 Tucanos, training center" },
  { name: "Luis del Valle Garcia Air Base", municipality: "Simon Bolivar (Barcelona)", state: "Anzoategui", population: 421424, type: "Air Base", region: "East", coast: "Coastal", urban: "Urban", notes: "Regular FAV deployments" },
  { name: "El Libertador Air Base (BAEL)", municipality: "Libertador (Palo Negro)", state: "Aragua", population: 113747, type: "Air Base", region: "Central", coast: "Near-Coastal", urban: "Urban", notes: "Largest air base, F-16A/B Block 15 (~3-8 operational), JY-27 anti-stealth radar, S-125 Pechora-2M" },
  { name: "General Jose Antonio Paez Air Base", municipality: "Atures (Puerto Ayacucho)", state: "Amazonas", population: 84114, type: "Air Base", region: "South/West", coast: "Interior", urban: "Small Urban", notes: "Southern border air operations, supports Amazonas region" },
  { name: "La Carlota AFB (Francisco de Miranda)", municipality: "Chacao", state: "Miranda", population: 72242, type: "Air Base", region: "Capital", coast: "Near-Coastal", urban: "Small Urban", notes: "Air Force HQ, 5th Air Zone, presidential transport" },
  { name: "Captain Manuel Rios Air Base (BAEMARI)", municipality: "Julian Mellado (El Sombrero)", state: "Guarico", population: 23940, type: "Air Base", region: "Central", coast: "Interior", urban: "Rural", notes: "S-300VM 'Antey-2500' air defense hub (~12 launchers), Grupo 11 'Diablos', satellite ground station" },
  
  // === ARMY DIVISION HQs (4) ===
  { name: "1st Infantry Division HQ", municipality: "Maracaibo", state: "Zulia", population: 1898770, type: "Army Division HQ", region: "West", coast: "Coastal", urban: "Major Metro", notes: "Western border defense: 11th Armored Brigade (T-72B1V, BMP-3), 12th Caribbean Ranger Brigade" },
  { name: "2nd Infantry Division HQ", municipality: "San Cristobal", state: "Tachira", population: 260173, type: "Army Division HQ", region: "West", coast: "Interior", urban: "Urban", notes: "Colombian border defense" },
  { name: "4th Armored Division HQ", municipality: "Girardot (Maracay)", state: "Aragua", population: 401294, type: "Army Division HQ", region: "Central", coast: "Near-Coastal", urban: "Urban", notes: "Primary armored strike force: T-72B1V, 42nd Airborne Brigade (elite), Smerch MRLs, Msta-S. Also has the 41st Armored Brigade" },
  { name: "5th Jungle Division HQ", municipality: "Heres (Ciudad Bolivar)", state: "Bolivar", population: 335208, type: "Army Division HQ", region: "South", coast: "Interior", urban: "Urban", notes: "Southern/jungle operations command" },
  
  // === ARMY FORTS (9) ===
  { name: "Fort Tiuna", municipality: "Libertador", state: "Distrito Capital", population: 2073055, type: "Army HQ/Fort", region: "Capital", coast: "Near-Coastal", urban: "Major Metro", notes: "Main Army HQ, Ministry of Defense, strategic command center" },
  { name: "Fort Paramacay", municipality: "Valencia", state: "Carabobo", population: 861367, type: "Army Fort", region: "Central", coast: "Near-Coastal", urban: "Major Metro", notes: "82nd Logistics Support Regiment, Battalion 822" },
  { name: "Fort Paramaconi", municipality: "Maturin", state: "Monagas", population: 447283, type: "Army Fort", region: "East", coast: "Interior", urban: "Urban", notes: "32nd Caribbean Brigade HQ" },
  { name: "Fort Tabacare", municipality: "Barinas", state: "Barinas", population: 300455, type: "Army Fort", region: "West", coast: "Interior", urban: "Urban", notes: "93rd Caribbean Brigade HQ, Battalion 716 Army Aviation" },
  { name: "Fort Guaicaipuro", municipality: "Cristobal Rojas (Charallave)", state: "Miranda", population: 117594, type: "Army Fort", region: "Capital", coast: "Near-Coastal", urban: "Urban", notes: "CENAPROMIL military prison, Bolivarian Military University branch, National Guard maintenance" },
  { name: "Fort Manaure", municipality: "Torres (Carora)", state: "Lara", population: 100687, type: "Army Fort", region: "West", coast: "Interior", urban: "Urban", notes: "Battalion 111, 11th Armored Brigade" },
  { name: "Fort Murachi", municipality: "Torondoy", state: "Tachira", population: 54313, type: "Army Fort", region: "West", coast: "Interior", urban: "Small Urban", notes: "Mountain infantry operations" },
  { name: "Fort Mara", municipality: "Mara", state: "Zulia", population: 207721, type: "Army Fort", region: "West", coast: "Interior", urban: "Urban", notes: "11th Armored Brigade" },
  { name: "Fort Tarabay", municipality: "Sifontes (Tumeremo)", state: "Bolivar", population: 27271, type: "Army Fort", region: "East", coast: "Interior", urban: "Rural", notes: "99th Jungle Infantry Brigade" },
  { name: "Fort Yocoima", municipality: "Roscio (Guasipati)", state: "Bolivar", population: 19840, type: "Army Fort", region: "East", coast: "Interior", urban: "Rural", notes: "51st Jungle Infantry Brigade, 512 Forest Battalion" },
  
  // === OTHER MILITARY HQs (3) ===
  { name: "Fort Montaña (Cuartel de la Montaña)", municipality: "Libertador", state: "Distrito Capital", population: 2073055, type: "Militia HQ", region: "Capital", coast: "Near-Coastal", urban: "Major Metro", notes: "Bolivarian Militia headquarters, Hugo Chávez mausoleum" },
  { name: "GNB Comandancia General", municipality: "Libertador (Maripérez)", state: "Distrito Capital", population: 2073055, type: "National Guard HQ", region: "Capital", coast: "Near-Coastal", urban: "Major Metro", notes: "National Guard command, internal security operations" },
  { name: "Meseta de Mamo Marine Base", municipality: "Vargas", state: "La Guaira", population: 18704, type: "Marine Corps HQ", region: "Capital", coast: "Coastal", urban: "Small Urban", notes: "Marine Infantry headquarters" },
  
  // === NAVAL FACILITIES (11) ===
  { name: "Puerto Cabello", municipality: "Puerto Cabello", state: "Carabobo", population: 183367, type: "Naval Port", region: "Central", coast: "Coastal", urban: "Urban", notes: "Largest naval base, frigates, submarines, main fleet" },
  { name: "Puerto La Cruz", municipality: "Juan Antonio Sotillo", state: "Anzoategui", population: 243572, type: "Naval Port", region: "East", coast: "Coastal", urban: "Urban", notes: "Major oil refinery port" },
  { name: "Punto Fijo Naval Base", municipality: "Carirubana (Punto Fijo)", state: "Falcon", population: 127953, type: "Naval Port", region: "West", coast: "Coastal", urban: "Urban", notes: "Western Naval Zone HQ, S-125 Pechora M2 air defense, protects Paraguaná refinery complex" },
  { name: "Carupano Port", municipality: "Bermudez", state: "Sucre", population: 138798, type: "Naval Port", region: "East", coast: "Coastal", urban: "Urban", notes: "Eastern coastal patrol base" },
  { name: "Porlamar (Isla Margarita)", municipality: "Marino (Porlamar)", state: "Nueva Esparta", population: 97667, type: "Naval Port", region: "East", coast: "Coastal", urban: "Small Urban", notes: "Island naval presence, tourism/security" },
  { name: "Guiria Port", municipality: "Valdez", state: "Sucre", population: 29115, type: "Naval Port", region: "East", coast: "Coastal", urban: "Small Urban", notes: "Trinidad-facing port, smuggling concern" },
  { name: "La Guaira Port", municipality: "Vargas", state: "La Guaira", population: 18704, type: "Naval Port", region: "Capital", coast: "Coastal", urban: "Small Urban", notes: "Capital's main port, strategic access point" },
  { name: "Los Testigos Island", municipality: "Dependencias Federales", state: "Dependencias Federales", population: 2116, type: "Naval Port", region: "East", coast: "Coastal", urban: "Rural", notes: "Remote island naval outpost" },
  { name: "Orchilla Island", municipality: "Dependencias Federales", state: "Dependencias Federales", population: 2116, type: "Naval Port", region: "Capital", coast: "Coastal", urban: "Rural", notes: "Presidential retreat, naval/air facility" },
  { name: "Turiamo Naval Air Base", municipality: "Coast", state: "Aragua", population: 29478, type: "Naval Air Base", region: "Central", coast: "Coastal", urban: "Small Urban", notes: "Naval aviation, coastal patrol aircraft" },
  { name: "River Command Gral. de BGDA. Franz Risquez Irribaren", municipality: "Heres (Ciudad Bolivar)", state: "Bolivar", population: 342280, type: "Naval Facility", region: "South", coast: "Interior", urban: "Urban", notes: "Orinoco River naval presence" },
  { name: "Punta Barima Naval Station", municipality: "Pedernales", state: "Delta Amacuro", population: 6438, type: "Naval Station", region: "East", coast: "Coastal", urban: "Rural", notes: "Delta Amacuro maritime patrol" },
  
  // === DRUG TRAFFICKING REGIONS (9) ===
  { name: "Apure - San Fernando", municipality: "San Fernando", state: "Apure", population: 165135, type: "Drug Trafficking Region", region: "West", coast: "Interior", urban: "Urban", notes: "State capital, military HQ, Llanero drug route hub" },
  { name: "Apure Border Region - Guasdualito", municipality: "Paez (Guasdualito)", state: "Apure", population: 100125, type: "Drug Trafficking Region", region: "West", coast: "Interior", urban: "Urban", notes: "FARC/ELN controlled crossings, 100+ drug flights alleged" },
  { name: "Apure - Elorza", municipality: "Romulo Gallegos (Elorza)", state: "Apure", population: 24418, type: "Drug Trafficking Region", region: "West", coast: "Interior", urban: "Rural", notes: "Clandestine airstrips, Colombian border" },
  { name: "Falcon - Transit Zone", municipality: "Various", state: "Falcon", population: 350217, type: "Drug Trafficking Region", region: "West", coast: "Coastal", urban: "Urban", notes: "Maritime drug transit point to Caribbean" },
  { name: "Zulia - Machiques", municipality: "Machiques de Perija", state: "Zulia", population: 64283, type: "Drug Trafficking Region", region: "West", coast: "Interior", urban: "Small Urban", notes: "Colombian border region, drug/fuel smuggling" },
  { name: "Zulia - Catatumbo Border", municipality: "Jesus Maria Semprun", state: "Zulia", population: 30948, type: "Drug Trafficking Region", region: "West", coast: "Interior", urban: "Rural", notes: "Active ELN territory, coca cultivation" },
  { name: "Guarico - Drug Aircraft Storage", municipality: "Guarico State (Various)", state: "Guarico", population: 35655, type: "Drug Trafficking Region", region: "Central", coast: "Interior", urban: "Rural", notes: "Known for clandestine narco aircraft storage" },
  { name: "Cojedes - Transit Zone", municipality: "Pao de San Juan Bautista", state: "Cojedes", population: 16915, type: "Drug Trafficking Region", region: "Central", coast: "Interior", urban: "Small Urban", notes: "Interior drug transit corridor" },
  { name: "Amazonas - Border Region", municipality: "Atabapo", state: "Amazonas", population: 9584, type: "Drug Trafficking Region", region: "South", coast: "Interior", urban: "Rural", notes: "Remote southern border, minimal state presence" },
  
  // === OTHER MILITARY (2) ===
  { name: "CAVIM Arms Complex", municipality: "Girardot (Maracay)", state: "Aragua", population: 401294, type: "Defense Industry", region: "Central", coast: "Near-Coastal", urban: "Urban", notes: "State arms manufacturer, ammunition production" },
  { name: "Anacoco Island Military Base", municipality: "Disputed (Cuyuni River)", state: "Bolivar/Essequibo", population: 500, type: "Forward Operating Base", region: "South", coast: "Interior", urban: "Rural", notes: "Disputed territory with Guyana, forward military presence" },
  
  // === URBAN UNREST LOCATIONS - TIER 1 (5) ===
  { name: "Petare / Sucre Municipality", municipality: "Sucre", state: "Miranda", population: 372470, type: "Urban Center", region: "Capital", coast: "Near-Coastal", urban: "Major Metro", notes: "Largest Caracas barrio, distinct from Libertador; protest hotspot" },
  { name: "Mérida", municipality: "Mérida", state: "Merida", population: 213962, type: "Urban Center", region: "West", coast: "Interior", urban: "Urban", notes: "University city, historically active in protests" },
  { name: "Cumaná", municipality: "Cumaná", state: "Sucre", population: 310763, type: "Urban Center", region: "East", coast: "Coastal", urban: "Urban", notes: "State capital, not covered by Carúpano targets" },
  { name: "Los Teques", municipality: "Los Teques", state: "Miranda", population: 194655, type: "Urban Center", region: "Capital", coast: "Near-Coastal", urban: "Urban", notes: "Miranda state capital, Caracas periphery" },
  { name: "Coro", municipality: "Coro", state: "Falcon", population: 195496, type: "Urban Center", region: "West", coast: "Coastal", urban: "Urban", notes: "State capital, not covered by Punto Fijo" },
  
  // === URBAN UNREST LOCATIONS - TIER 2 (7) ===
  { name: "Guarenas / Guatire", municipality: "Guarenas-Guatire", state: "Miranda", population: 208565, type: "Urban Center", region: "Capital", coast: "Near-Coastal", urban: "Urban", notes: "Caracas dormitory cities, 2014/2017 protest sites" },
  { name: "Valera", municipality: "Valera", state: "Trujillo", population: 132562, type: "Urban Center", region: "West", coast: "Interior", urban: "Urban", notes: "Andean city, opposition stronghold" },
  { name: "Cabimas", municipality: "Cabimas", state: "Zulia", population: 255567, type: "Urban Center", region: "West", coast: "Coastal", urban: "Urban", notes: "Oil industry city near Maracaibo" },
  { name: "Ciudad Ojeda", municipality: "Ciudad Ojeda", state: "Zulia", population: 138208, type: "Urban Center", region: "West", coast: "Coastal", urban: "Urban", notes: "Oil industry, Maracaibo metro" },
  { name: "Acarigua", municipality: "Acarigua", state: "Portuguesa", population: 287368, type: "Urban Center", region: "West", coast: "Interior", urban: "Urban", notes: "Llanos agricultural hub" },
  { name: "El Tigre", municipality: "El Tigre", state: "Anzoategui", population: 179333, type: "Urban Center", region: "East", coast: "Interior", urban: "Urban", notes: "Oil industry city" },
  { name: "Porlamar (Urban)", municipality: "Marino (Porlamar)", state: "Nueva Esparta", population: 97667, type: "Urban Center", region: "East", coast: "Coastal", urban: "Small Urban", notes: "Margarita Island hub, tourism center" },
  
  // === URBAN UNREST LOCATIONS - TIER 3 (Major cities also with military targets) ===
  { name: "Caracas (Urban)", municipality: "Libertador", state: "Distrito Capital", population: 2073055, type: "Urban Center", region: "Capital", coast: "Near-Coastal", urban: "Major Metro", notes: "National capital, major protest center, distinct from military installations" },
  { name: "Maracaibo (Urban)", municipality: "Maracaibo", state: "Zulia", population: 1898770, type: "Urban Center", region: "West", coast: "Coastal", urban: "Major Metro", notes: "Second largest city, oil industry hub, opposition stronghold" },
  { name: "Valencia (Urban)", municipality: "Valencia", state: "Carabobo", population: 1378958, type: "Urban Center", region: "Central", coast: "Near-Coastal", urban: "Major Metro", notes: "Industrial capital, major manufacturing center" },
  { name: "Barquisimeto (Urban)", municipality: "Iribarren (Barquisimeto)", state: "Lara", population: 936065, type: "Urban Center", region: "West", coast: "Interior", urban: "Major Metro", notes: "Fourth largest city, commercial hub" },
  { name: "Maracay (Urban)", municipality: "Girardot (Maracay)", state: "Aragua", population: 401294, type: "Urban Center", region: "Central", coast: "Near-Coastal", urban: "Urban", notes: "Military city, significant garrison presence" },
  { name: "Ciudad Guayana (Urban)", municipality: "Caroni (Puerto Ordaz)", state: "Bolivar", population: 672651, type: "Urban Center", region: "East", coast: "Interior", urban: "Major Metro", notes: "Heavy industry center, steel/aluminum production" },
  { name: "Maturín (Urban)", municipality: "Maturin", state: "Monagas", population: 447283, type: "Urban Center", region: "East", coast: "Interior", urban: "Urban", notes: "Eastern oil industry hub" },
  { name: "Barcelona (Urban)", municipality: "Simon Bolivar (Barcelona)", state: "Anzoategui", population: 382881, type: "Urban Center", region: "East", coast: "Coastal", urban: "Urban", notes: "Eastern coastal city, petrochemical industry" },
  { name: "San Cristóbal (Urban)", municipality: "San Cristobal", state: "Tachira", population: 260173, type: "Urban Center", region: "West", coast: "Interior", urban: "Urban", notes: "Andean border city, Colombian trade hub, 2014 protest epicenter" },
];

const SCENARIO_PRESETS = {
  custom: { name: "Custom Selection", targets: [], description: "Select individual targets" },
  airSuperiority: { 
    name: "Air Superiority Campaign", 
    targets: TARGETS_DATA.filter(t => t.type === "Air Base" || t.type === "Naval Air Base").map(t => t.name),
    description: "All 10 air bases including naval aviation — neutralize Venezuelan air capability"
  },
  counterNarcotics: { 
    name: "Counter-Narcotics Operation", 
    targets: TARGETS_DATA.filter(t => t.type === "Drug Trafficking Region").map(t => t.name),
    description: "All 9 drug trafficking regions — disrupt cartel/state narco infrastructure"
  },
  navalDenial: { 
    name: "Naval Blockade/Denial", 
    targets: TARGETS_DATA.filter(t => 
      t.type === "Naval Port" || 
      t.type === "Naval Air Base" || 
      t.type === "Naval Facility" || 
      t.type === "Naval Station" ||
      t.type === "Marine Corps HQ"
    ).map(t => t.name),
    description: "All 13 naval/marine facilities — establish maritime control"
  },
  decapitation: { 
    name: "Decapitation Strike", 
    targets: [
      "Fort Tiuna",
      "La Carlota AFB (Francisco de Miranda)",
      "Fort Montaña (Cuartel de la Montaña)",
      "GNB Comandancia General",
      "Fort Guaicaipuro",
      "Meseta de Mamo Marine Base",
      "La Guaira Port",
      "Orchilla Island",
      "Petare / Sucre Municipality"
    ],
    description: "9 Capital region command & control targets — Fort Tiuna, HQs, key nodes"
  },
  groundForces: {
    name: "Ground Forces Degradation",
    targets: TARGETS_DATA.filter(t => 
      t.type === "Army HQ/Fort" || 
      t.type === "Army Fort" || 
      t.type === "Army Division HQ" ||
      t.type === "Militia HQ" ||
      t.type === "National Guard HQ"
    ).map(t => t.name),
    description: "All 16 army forts, division HQs, and paramilitary command — degrade ground capability"
  },
  fullConventional: { 
    name: "Full Conventional Campaign", 
    targets: TARGETS_DATA.filter(t => 
      !["Drug Trafficking Region", "Urban Center"].includes(t.type)
    ).map(t => t.name),
    description: "All 40 military targets — comprehensive degradation of armed forces"
  },
  civilUnrest: {
    name: "Civil Unrest Scenario",
    targets: TARGETS_DATA.filter(t => t.type === "Urban Center").map(t => t.name),
    description: "All 21 urban centers — model displacement from protests/civil conflict"
  }
};

// Get unique values for filters
const ALL_TYPES = ['all', ...new Set(TARGETS_DATA.map(t => t.type))].sort((a, b) => {
  if (a === 'all') return -1;
  if (b === 'all') return 1;
  return a.localeCompare(b);
});

const ALL_REGIONS = ['all', ...new Set(TARGETS_DATA.map(t => t.region))].sort((a, b) => {
  if (a === 'all') return -1;
  if (b === 'all') return 1;
  return a.localeCompare(b);
});

const ALL_STATES = ['all', ...new Set(TARGETS_DATA.map(t => t.state))].sort((a, b) => {
  if (a === 'all') return -1;
  if (b === 'all') return 1;
  return a.localeCompare(b);
});

export default function VenezuelaDisplacementDashboard() {
  const [selectedScenario, setSelectedScenario] = useState('custom');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [displacementRate, setDisplacementRate] = useState(0.01);
  const [populationMultiplier, setPopulationMultiplier] = useState(1.0);
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [showExport, setShowExport] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const filteredTargets = useMemo(() => {
    return TARGETS_DATA.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterRegion !== 'all' && t.region !== filterRegion) return false;
      if (filterState !== 'all' && t.state !== filterState) return false;
      return true;
    });
  }, [filterType, filterRegion, filterState]);

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    if (scenario !== 'custom') {
      setSelectedTargets(SCENARIO_PRESETS[scenario].targets);
      setFilterType('all');
      setFilterRegion('all');
      setFilterState('all');
    } else {
      setSelectedTargets([]);
    }
  };

  const toggleTarget = (targetName) => {
    setSelectedScenario('custom');
    setSelectedTargets(prev => 
      prev.includes(targetName) 
        ? prev.filter(t => t !== targetName)
        : [...prev, targetName]
    );
  };

  const selectAllFiltered = () => {
    setSelectedScenario('custom');
    const filteredNames = filteredTargets.map(t => t.name);
    setSelectedTargets(prev => [...new Set([...prev, ...filteredNames])]);
  };

  const clearSelection = () => {
    setSelectedTargets([]);
    setSelectedScenario('custom');
  };

  // Calculate with municipality deduplication
  const calculations = useMemo(() => {
    const selectedData = TARGETS_DATA.filter(t => selectedTargets.includes(t.name));
    
    // Deduplicate by municipality - use highest population if multiple targets in same municipality
    const municipalityMap = new Map();
    selectedData.forEach(target => {
      const key = `${target.municipality}-${target.state}`;
      if (!municipalityMap.has(key) || municipalityMap.get(key).population < target.population) {
        municipalityMap.set(key, target);
      }
    });
    
    const uniqueMunicipalities = Array.from(municipalityMap.values());
    
    const byType = {};
    const byRegion = {};
    let totalPop = 0;
    let totalDisplaced = 0;

    uniqueMunicipalities.forEach(target => {
      const adjustedPop = Math.round(target.population * populationMultiplier);
      const displaced = Math.round(adjustedPop * (displacementRate / 100));
      totalPop += adjustedPop;
      totalDisplaced += displaced;

      // Count by type (use all selected targets, not deduplicated, for type counts)
      selectedData.filter(t => `${t.municipality}-${t.state}` === `${target.municipality}-${target.state}`).forEach(t => {
        if (!byType[t.type]) byType[t.type] = { count: 0, displaced: 0 };
        byType[t.type].count++;
      });
      // But displacement is from deduplicated
      const primaryType = target.type;
      if (byType[primaryType]) byType[primaryType].displaced += displaced;

      if (!byRegion[target.region]) byRegion[target.region] = { count: 0, displaced: 0 };
      byRegion[target.region].count++;
      byRegion[target.region].displaced += displaced;
    });

    return { 
      selectedData, 
      uniqueMunicipalities,
      byType, 
      byRegion, 
      totalPop, 
      totalDisplaced,
      deduplicatedCount: uniqueMunicipalities.length,
      rawCount: selectedData.length
    };
  }, [selectedTargets, displacementRate, populationMultiplier]);

  const generateExportText = () => {
    const { selectedData, uniqueMunicipalities, byType, byRegion, totalPop, totalDisplaced, deduplicatedCount, rawCount } = calculations;
    const scenarioName = selectedScenario !== 'custom' 
      ? SCENARIO_PRESETS[selectedScenario].name 
      : 'Custom Selection';
    
    let text = `VENEZUELA DISPLACEMENT SCENARIO ANALYSIS\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Scenario: ${scenarioName}\n`;
    text += `Displacement Rate: ${displacementRate}%\n`;
    text += `Population Adjustment: ${populationMultiplier.toFixed(2)}x (base: 2011 census)\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    text += `SUMMARY\n${'-'.repeat(30)}\n`;
    text += `Targets Selected: ${rawCount}`;
    if (rawCount !== deduplicatedCount) {
      text += ` (${deduplicatedCount} unique municipalities after deduplication)`;
    }
    text += `\n`;
    text += `Total Affected Population: ${totalPop.toLocaleString()}\n`;
    text += `Projected Displacement: ${totalDisplaced.toLocaleString()}\n\n`;

    text += `BY TARGET TYPE\n${'-'.repeat(30)}\n`;
    Object.entries(byType)
      .sort((a, b) => b[1].displaced - a[1].displaced)
      .forEach(([type, data]) => {
        text += `${type}: ${data.count} targets, ${data.displaced.toLocaleString()} displaced\n`;
      });

    text += `\nBY REGION\n${'-'.repeat(30)}\n`;
    Object.entries(byRegion)
      .sort((a, b) => b[1].displaced - a[1].displaced)
      .forEach(([region, data]) => {
        text += `${region}: ${data.count} municipalities, ${data.displaced.toLocaleString()} displaced\n`;
      });

    text += `\nTARGET DETAILS\n${'-'.repeat(30)}\n`;
    selectedData
      .sort((a, b) => b.population - a.population)
      .forEach(target => {
        const adjustedPop = Math.round(target.population * populationMultiplier);
        const displaced = Math.round(adjustedPop * (displacementRate / 100));
        text += `\n${target.name}\n`;
        text += `  Location: ${target.municipality}, ${target.state}\n`;
        text += `  Type: ${target.type} | Region: ${target.region}\n`;
        text += `  Adjusted Population: ${adjustedPop.toLocaleString()}\n`;
        text += `  Projected Displacement: ${displaced.toLocaleString()}\n`;
        if (target.notes) text += `  Notes: ${target.notes}\n`;
      });

    text += `\n${'='.repeat(50)}\n`;
    text += `METHODOLOGY NOTES\n`;
    text += `- Population data: 2011 Venezuelan census (municipal level)\n`;
    text += `- Displacement calculated as ${displacementRate}% of adjusted municipal population\n`;
    text += `- Default rate (0.01%) reflects minimal/surgical strike assumption\n`;
    text += `- Overlapping targets in same municipality are deduplicated to avoid double-counting\n`;
    text += `- This model estimates SHORT-TERM displacement only; multi-year projections require additional modeling\n`;
    text += `- Secondary/ripple effects (neighboring areas fleeing) are not included\n\n`;
    text += `AUTHORS\n`;
    text += `Gil Guerra and Claire Holba, Niskanen Center\n\n`;
    text += `CORRECTIONS & QUESTIONS\n`;
    text += `gguerra@niskanencenter.org\n`;

    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateExportText());
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f14',
      color: '#e8eaed',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        .card {
          background: linear-gradient(135deg, #141a22 0%, #0d1117 100%);
          border: 1px solid #2a3441;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }
        
        .card-header {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #7d8590;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #2a3441;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        
        .btn-primary {
          background: #2563eb;
          color: white;
          border-color: #3b82f6;
        }
        
        .btn-primary:hover {
          background: #1d4ed8;
        }
        
        .btn-secondary {
          background: #1f2937;
          color: #9ca3af;
          border-color: #374151;
        }
        
        .btn-secondary:hover {
          background: #374151;
          color: #e5e7eb;
        }
        
        .btn-scenario {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #2a3441;
          text-align: left;
          padding: 12px 16px;
          width: 100%;
          margin-bottom: 8px;
        }
        
        .btn-scenario:hover {
          border-color: #3b82f6;
          color: #e5e7eb;
        }
        
        .btn-scenario.active {
          background: rgba(37, 99, 235, 0.15);
          border-color: #3b82f6;
          color: #60a5fa;
        }
        
        .slider-container {
          margin: 16px 0;
        }
        
        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #2a3441;
          outline: none;
          -webkit-appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #60a5fa;
        }
        
        .select-input {
          background: #1a2332;
          border: 1px solid #2a3441;
          color: #e8eaed;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 13px;
          width: 100%;
          cursor: pointer;
        }
        
        .select-input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .target-list {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }
        
        .target-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .target-list::-webkit-scrollbar-track {
          background: #1a2332;
          border-radius: 3px;
        }
        
        .target-list::-webkit-scrollbar-thumb {
          background: #3b4b5c;
          border-radius: 3px;
        }
        
        .target-item {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          margin-bottom: 6px;
          background: #0d1117;
          border: 1px solid #2a3441;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .target-item:hover {
          border-color: #3b82f6;
        }
        
        .target-item.selected {
          background: rgba(37, 99, 235, 0.1);
          border-color: #3b82f6;
        }
        
        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #4b5563;
          border-radius: 4px;
          margin-right: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }
        
        .checkbox.checked {
          background: #2563eb;
          border-color: #3b82f6;
        }
        
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        
        .stat-box {
          background: #0d1117;
          border: 1px solid #2a3441;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          overflow: hidden;
        }
        
        .stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 22px;
          font-weight: 600;
          color: #60a5fa;
          margin-bottom: 4px;
          word-wrap: break-word;
        }
        
        .stat-value-red {
          color: #f87171;
        }
        
        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7d8590;
        }
        
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #1f2937;
          font-size: 13px;
        }
        
        .breakdown-row:last-child {
          border-bottom: none;
        }
        
        .tag {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          margin-right: 6px;
        }
        
        .tag-type {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }
        
        .tag-region {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        
        .modal-content {
          background: #141a22;
          border: 1px solid #2a3441;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #2a3441;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        
        .export-text {
          background: #0a0f14;
          border: 1px solid #2a3441;
          border-radius: 6px;
          padding: 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
          color: #9ca3af;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .info-box {
          background: #1a2332;
          padding: 12px;
          border-radius: 6px;
          font-size: 11px;
          color: #7d8590;
          margin-top: 12px;
          line-height: 1.5;
        }
        
        .info-box strong {
          color: #9ca3af;
        }
        
        .attribution {
          font-size: 11px;
          color: #6b7280;
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #1f2937;
          margin-top: 16px;
          line-height: 1.6;
        }
        
        .link {
          color: #60a5fa;
          text-decoration: none;
        }
        
        .link:hover {
          text-decoration: underline;
        }
        
        .dedup-note {
          font-size: 11px;
          color: #f59e0b;
          margin-top: 8px;
          padding: 8px;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 600, 
          margin: 0,
          color: '#f3f4f6'
        }}>
          Venezuela Strike Displacement Scenario Builder
        </h1>
        <p style={{ 
          color: '#7d8590', 
          marginTop: '8px',
          fontSize: '14px'
        }}>
          Model projected short-term civilian displacement from hypothetical U.S. strikes on Venezuelan military and strategic targets
        </p>
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '12px', fontSize: '12px', padding: '6px 12px' }}
          onClick={() => setShowMethodology(true)}
        >
          View Methodology & Limitations
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '24px' }}>
        
        {/* Left Column - Scenario Selection */}
        <div>
          <div className="card">
            <div className="card-header">Scenario Presets</div>
            {Object.entries(SCENARIO_PRESETS).map(([key, scenario]) => (
              <button
                key={key}
                className={`btn btn-scenario ${selectedScenario === key ? 'active' : ''}`}
                onClick={() => handleScenarioChange(key)}
              >
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{scenario.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{scenario.description}</div>
              </button>
            ))}
          </div>

          <div className="card">
            <div className="card-header">Parameters</div>
            
            <div className="slider-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Displacement Rate</span>
                <span style={{ 
                  fontFamily: 'IBM Plex Mono', 
                  fontSize: '14px',
                  color: '#60a5fa',
                  fontWeight: 500
                }}>
                  {displacementRate}%
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min="0.01"
                max="10"
                step="0.01"
                value={displacementRate}
                onChange={(e) => setDisplacementRate(parseFloat(e.target.value))}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '10px', 
                color: '#6b7280',
                marginTop: '4px'
              }}>
                <span>0.01% (surgical)</span>
                <span>10% (major)</span>
              </div>
            </div>

            <div className="slider-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Population Multiplier</span>
                <span style={{ 
                  fontFamily: 'IBM Plex Mono', 
                  fontSize: '14px',
                  color: '#60a5fa',
                  fontWeight: 500
                }}>
                  {populationMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min="0.7"
                max="1.2"
                step="0.01"
                value={populationMultiplier}
                onChange={(e) => setPopulationMultiplier(parseFloat(e.target.value))}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '10px', 
                color: '#6b7280',
                marginTop: '4px'
              }}>
                <span>0.7x (emigration)</span>
                <span>1.2x (growth)</span>
              </div>
            </div>

            <div className="info-box">
              <strong>Displacement Rate:</strong> Default (0.01%) reflects minimal/surgical strike. Increase for larger strike intensity or broader evacuation scenarios.<br/><br/>
              <strong>Population Multiplier:</strong> Adjusts 2011 census data for population changes. Use &lt;1.0 to account for Venezuela's significant emigration since 2011, or &gt;1.0 if modeling areas with population growth.
            </div>
          </div>
        </div>

        {/* Center Column - Target Selection */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Target Selection</span>
              <div>
                <button className="btn btn-secondary" onClick={selectAllFiltered} style={{ marginRight: '8px' }}>
                  Select Filtered
                </button>
                <button className="btn btn-secondary" onClick={clearSelection}>
                  Clear All
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <select 
                className="select-input" 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {ALL_TYPES.map(t => (
                  <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
                ))}
              </select>
              <select 
                className="select-input"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                {ALL_REGIONS.map(r => (
                  <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>
                ))}
              </select>
              <select 
                className="select-input"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
              >
                {ALL_STATES.map(s => (
                  <option key={s} value={s}>{s === 'all' ? 'All States' : s}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '12px', color: '#7d8590', marginBottom: '12px' }}>
              Showing {filteredTargets.length} targets · {selectedTargets.length} selected
            </div>

            <div className="target-list">
              {filteredTargets.map(target => {
                const isSelected = selectedTargets.includes(target.name);
                const adjustedPop = Math.round(target.population * populationMultiplier);
                const displaced = Math.round(adjustedPop * (displacementRate / 100));
                
                return (
                  <div 
                    key={target.name}
                    className={`target-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTarget(target.name)}
                  >
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>{target.name}</div>
                      <div style={{ fontSize: '12px', color: '#7d8590', marginBottom: '6px' }}>
                        {target.municipality}, {target.state}
                      </div>
                      <div>
                        <span className="tag tag-type">{target.type}</span>
                        <span className="tag tag-region">{target.region}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {isSelected ? (
                        <>
                          <div style={{ 
                            fontFamily: 'IBM Plex Mono', 
                            fontSize: '14px',
                            color: '#60a5fa'
                          }}>
                            {displaced.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>displaced</div>
                        </>
                      ) : (
                        <>
                          <div style={{ 
                            fontFamily: 'IBM Plex Mono', 
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            {adjustedPop.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>population</div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div>
          <div className="card">
            <div className="card-header">Scenario Summary</div>
            
            <div className="stat-grid">
              <div className="stat-box">
                <div className="stat-value">{calculations.deduplicatedCount}</div>
                <div className="stat-label">Municipalities</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ fontSize: '18px' }}>
                  {calculations.totalPop.toLocaleString()}
                </div>
                <div className="stat-label">Affected Pop.</div>
              </div>
              <div className="stat-box">
                <div className="stat-value stat-value-red" style={{ fontSize: '18px' }}>
                  {calculations.totalDisplaced.toLocaleString()}
                </div>
                <div className="stat-label">Displaced</div>
              </div>
            </div>
            
            {calculations.rawCount !== calculations.deduplicatedCount && (
              <div className="dedup-note">
                Note: {calculations.rawCount} targets selected across {calculations.deduplicatedCount} unique municipalities. Overlapping populations deduplicated.
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">Breakdown by Type</div>
            {Object.entries(calculations.byType).length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No targets selected
              </div>
            ) : (
              Object.entries(calculations.byType)
                .sort((a, b) => b[1].displaced - a[1].displaced)
                .map(([type, data]) => (
                  <div key={type} className="breakdown-row">
                    <span style={{ color: '#9ca3af' }}>
                      {type} <span style={{ color: '#6b7280' }}>({data.count})</span>
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono', color: '#60a5fa' }}>
                      {data.displaced.toLocaleString()}
                    </span>
                  </div>
                ))
            )}
          </div>

          <div className="card">
            <div className="card-header">Breakdown by Region</div>
            {Object.entries(calculations.byRegion).length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No targets selected
              </div>
            ) : (
              Object.entries(calculations.byRegion)
                .sort((a, b) => b[1].displaced - a[1].displaced)
                .map(([region, data]) => (
                  <div key={region} className="breakdown-row">
                    <span style={{ color: '#9ca3af' }}>
                      {region} <span style={{ color: '#6b7280' }}>({data.count})</span>
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono', color: '#60a5fa' }}>
                      {data.displaced.toLocaleString()}
                    </span>
                  </div>
                ))
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px' }}
            onClick={() => setShowExport(true)}
            disabled={selectedTargets.length === 0}
          >
            Export Scenario Report
          </button>

          <div className="attribution">
            <strong>Gil Guerra and Claire Holba</strong>, Niskanen Center<br/>
            Corrections & questions: <a href="mailto:gguerra@niskanencenter.org" className="link">gguerra@niskanencenter.org</a>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px' }}>Export Scenario Report</h3>
              <div>
                <button className="btn btn-primary" onClick={copyToClipboard} style={{ marginRight: '8px' }}>
                  Copy to Clipboard
                </button>
                <button className="btn btn-secondary" onClick={() => setShowExport(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="export-text">
                {generateExportText()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="modal-overlay" onClick={() => setShowMethodology(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '16px' }}>Methodology & Limitations</h3>
              <button className="btn btn-secondary" onClick={() => setShowMethodology(false)}>
                Close
              </button>
            </div>
            <div className="modal-body" style={{ lineHeight: 1.7, color: '#9ca3af' }}>
              <h4 style={{ color: '#e8eaed', marginTop: 0 }}>Data Sources</h4>
              <p>Population figures are derived from the 2011 Venezuelan census at the municipal level. The population multiplier allows adjustment for demographic changes since 2011, including Venezuela's significant emigration wave.</p>
              
              <h4 style={{ color: '#e8eaed' }}>Displacement Calculation</h4>
              <p>Projected displacement = (Municipal Population × Population Multiplier) × Displacement Rate</p>
              <p>The default displacement rate of 0.01% reflects a minimal/surgical strike assumption. Users should adjust based on strike intensity, evacuation patterns, and conflict duration being modeled.</p>
              
              <h4 style={{ color: '#e8eaed' }}>Deduplication</h4>
              <p>When multiple targets are selected within the same municipality, the affected population is counted only once to avoid double-counting. The highest population figure among overlapping targets is used.</p>
              
              <h4 style={{ color: '#e8eaed' }}>Limitations</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Short-term only:</strong> This model estimates immediate/short-term displacement. Multi-year projections require additional modeling of conflict duration, economic collapse, and cascading effects.</li>
                <li><strong>No ripple effects:</strong> Secondary displacement from neighboring areas (people fleeing due to fear/instability rather than direct strikes) is not included.</li>
                <li><strong>Municipal-level granularity:</strong> Population is attributed at the municipal level; actual displacement patterns would vary based on precise strike locations within municipalities.</li>
                <li><strong>Census age:</strong> 2011 data may not reflect current population distribution, particularly in areas affected by internal migration.</li>
              </ul>
              
              <h4 style={{ color: '#e8eaed' }}>Contact</h4>
              <p>For corrections, questions, or methodological inquiries: <a href="mailto:gguerra@niskanencenter.org" className="link">gguerra@niskanencenter.org</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
