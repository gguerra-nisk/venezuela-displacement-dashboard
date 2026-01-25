import React, { useState, useMemo, useEffect } from 'react';

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

  // === AIR DEFENSE & COMMUNICATIONS (4) ===
  { name: "Catia La Mar Air Defense Site", municipality: "Catia La Mar", state: "La Guaira", population: 85288, type: "Air Defense Site", region: "Capital", coast: "Coastal", urban: "Urban", notes: "Air defense storage facility; 393rd Air Defense Missile Group" },
  { name: "Higuerote Airport", municipality: "Brión", state: "Miranda", population: 27362, type: "Air Base", region: "East", coast: "Coastal", urban: "Small Urban", notes: "Buk-M2E air defense system site" },
  { name: "Cerro El Volcán", municipality: "El Hatillo", state: "Miranda", population: 85392, type: "Communications Site", region: "Capital", coast: "Near-Coastal", urban: "Urban", notes: "Military communications/telecommunications tower" },
  { name: "Los Altos de Irapa Radar Station", municipality: "Libertador", state: "Distrito Capital", population: 63800, type: "Radar Station", region: "Capital", coast: "Near-Coastal", urban: "Urban", notes: "Early warning radar installation near El Junquito" },

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
  operationAbsoluteResolve: {
    name: "Operation Absolute Resolve",
    targets: [
      "Fort Tiuna",
      "La Carlota AFB (Francisco de Miranda)",
      "La Guaira Port",
      "Catia La Mar Air Defense Site",
      "Higuerote Airport",
      "Cerro El Volcán",
      "Fort Guaicaipuro",
      "El Libertador Air Base (BAEL)",
      "Fort Montaña (Cuartel de la Montaña)",
      "Los Altos de Irapa Radar Station"
    ],
    description: "Targets struck in January 2026 U.S. military operation. Note: Two electrical substations in southern Caracas were also disrupted but are not included."
  },
  airSuperiority: {
    name: "Air Superiority Campaign",
    targets: TARGETS_DATA.filter(t => t.type === "Air Base" || t.type === "Naval Air Base").map(t => t.name),
    description: "All 10 air bases including naval aviation — neutralize Venezuelan air capability"
  },
  airDefenseNeutralization: {
    name: "Air Defense Neutralization",
    targets: [
      "Catia La Mar Air Defense Site",
      "Higuerote Airport",
      "Los Altos de Irapa Radar Station",
      "Cerro El Volcán",
      "Captain Manuel Rios Air Base (BAEMARI)"
    ],
    description: "Target integrated air defense network (Buk-M2E, S-300VM, S-125 systems) and radar installations to establish air superiority."
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
    description: "All 44 military targets — comprehensive degradation of armed forces"
  },
  postTransitionUnrest: {
    name: "Post-Transition Civil Unrest",
    targets: [
      "Caracas (Urban)",
      "Maracaibo (Urban)",
      "Valencia (Urban)",
      "Barquisimeto (Urban)",
      "Maracay (Urban)",
      "Petare / Sucre Municipality",
      "Los Teques",
      "Guarenas / Guatire",
      "Cabimas",
      "Ciudad Ojeda",
      "Coro",
      "Acarigua",
      "Valera"
    ],
    description: "Major urban centers in politically contested regions — model displacement from potential post-regime instability or factional conflict."
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
  const [displacementRate, setDisplacementRate] = useState(0.001);
  const [populationMultiplier, setPopulationMultiplier] = useState(1.0);
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [showExport, setShowExport] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [customTargets, setCustomTargets] = useState([]);
  const [showCustomTargetModal, setShowCustomTargetModal] = useState(false);
  const [customTargetForm, setCustomTargetForm] = useState({
    name: '',
    municipality: '',
    state: '',
    population: '',
    type: '',
    region: '',
    notes: ''
  });

  // Read URL parameters on mount to restore shared state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const scenarioParam = params.get('scenario');
    const targetsParam = params.get('targets');
    const rateParam = params.get('rate');
    const multParam = params.get('mult');

    if (rateParam) {
      const rate = parseFloat(rateParam);
      if (!isNaN(rate) && rate >= 0.001 && rate <= 10) {
        setDisplacementRate(rate);
      }
    }

    if (multParam) {
      const mult = parseFloat(multParam);
      if (!isNaN(mult) && mult >= 0.7 && mult <= 1.2) {
        setPopulationMultiplier(mult);
      }
    }

    if (scenarioParam && scenarioParam !== 'custom' && SCENARIO_PRESETS[scenarioParam]) {
      setSelectedScenario(scenarioParam);
      setSelectedTargets(SCENARIO_PRESETS[scenarioParam].targets);
    } else if (targetsParam) {
      const targetNames = targetsParam.split(',').map(t => decodeURIComponent(t.trim()));
      const validTargets = targetNames.filter(name =>
        TARGETS_DATA.some(t => t.name === name)
      );
      if (validTargets.length > 0) {
        setSelectedScenario('custom');
        setSelectedTargets(validTargets);
      }
    }
  }, []);

  // Merge base targets with custom targets
  const allTargets = useMemo(() => {
    return [...TARGETS_DATA, ...customTargets];
  }, [customTargets]);

  const filteredTargets = useMemo(() => {
    return allTargets.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterRegion !== 'all' && t.region !== filterRegion) return false;
      if (filterState !== 'all' && t.state !== filterState) return false;
      return true;
    });
  }, [filterType, filterRegion, filterState, allTargets]);

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

  // Custom target form handlers
  const handleCustomTargetChange = (field, value) => {
    setCustomTargetForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomTargetSubmit = () => {
    // Validate required fields
    if (!customTargetForm.name.trim()) {
      alert('Target name is required');
      return;
    }
    if (!customTargetForm.municipality.trim()) {
      alert('Municipality is required');
      return;
    }
    if (!customTargetForm.state) {
      alert('State is required');
      return;
    }
    if (!customTargetForm.population || parseFloat(customTargetForm.population) <= 0) {
      alert('Population must be a positive number');
      return;
    }
    if (!customTargetForm.type) {
      alert('Type is required');
      return;
    }
    if (!customTargetForm.region) {
      alert('Region is required');
      return;
    }

    // Check for duplicate name
    if (allTargets.some(t => t.name.toLowerCase() === customTargetForm.name.trim().toLowerCase())) {
      alert('A target with this name already exists');
      return;
    }

    const newTarget = {
      name: customTargetForm.name.trim(),
      municipality: customTargetForm.municipality.trim(),
      state: customTargetForm.state,
      population: parseInt(customTargetForm.population),
      type: customTargetForm.type,
      region: customTargetForm.region,
      coast: 'Unknown',
      urban: 'Unknown',
      notes: customTargetForm.notes.trim(),
      isCustom: true,
      customId: Date.now()
    };

    setCustomTargets(prev => [...prev, newTarget]);
    setCustomTargetForm({
      name: '',
      municipality: '',
      state: '',
      population: '',
      type: '',
      region: '',
      notes: ''
    });
    setShowCustomTargetModal(false);
  };

  const deleteCustomTarget = (customId) => {
    const target = customTargets.find(t => t.customId === customId);
    if (target) {
      setSelectedTargets(prev => prev.filter(name => name !== target.name));
      setCustomTargets(prev => prev.filter(t => t.customId !== customId));
    }
  };

  // Generate shareable URL with current state
  const generateShareableUrl = () => {
    const params = new URLSearchParams();

    // Add displacement rate if not default
    if (displacementRate !== 0.001) {
      params.set('rate', displacementRate.toString());
    }

    // Add population multiplier if not default
    if (populationMultiplier !== 1.0) {
      params.set('mult', populationMultiplier.toString());
    }

    // Add scenario or targets
    if (selectedScenario !== 'custom') {
      params.set('scenario', selectedScenario);
    } else if (selectedTargets.length > 0) {
      params.set('targets', selectedTargets.map(t => encodeURIComponent(t)).join(','));
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Copy shareable URL to clipboard
  const copyShareableUrl = () => {
    const url = generateShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // Export scenario data to CSV
  const exportToCSV = () => {
    const { selectedData } = calculations;
    const headers = ['Target', 'Municipality', 'State', 'Type', 'Region', 'Base Population', 'Adjusted Population', 'Displacement Rate (%)', 'Projected Displacement', 'Notes'];

    const rows = selectedData.map(target => {
      const adjustedPop = Math.round(target.population * populationMultiplier);
      const displaced = Math.round(adjustedPop * (displacementRate / 100));
      return [
        target.name,
        target.municipality,
        target.state,
        target.type,
        target.region,
        target.population,
        adjustedPop,
        displacementRate,
        displaced,
        target.notes || ''
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `venezuela-displacement-scenario-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save current scenario for comparison
  const saveCurrentScenario = () => {
    if (savedScenarios.length >= 3) {
      alert('Maximum 3 scenarios for comparison. Remove one first.');
      return;
    }
    const scenarioName = selectedScenario !== 'custom'
      ? SCENARIO_PRESETS[selectedScenario].name
      : `Custom (${selectedTargets.length} targets)`;

    const newScenario = {
      id: Date.now(),
      name: scenarioName,
      targets: [...selectedTargets],
      displacementRate,
      populationMultiplier,
      calculations: { ...calculations }
    };
    setSavedScenarios([...savedScenarios, newScenario]);
  };

  // Remove a saved scenario
  const removeScenario = (id) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
  };

  // Load a saved scenario
  const loadScenario = (scenario) => {
    setSelectedTargets(scenario.targets);
    setDisplacementRate(scenario.displacementRate);
    setPopulationMultiplier(scenario.populationMultiplier);
    setSelectedScenario('custom');
    setShowComparison(false);
  };

  // Calculate with municipality deduplication
  const calculations = useMemo(() => {
    const selectedData = allTargets.filter(t => selectedTargets.includes(t.name));
    
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
  }, [selectedTargets, displacementRate, populationMultiplier, allTargets]);

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
    text += `- Default rate (0.001%) reflects minimal strike assumption\n`;
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
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }

        /* ========== ANIMATIONS ========== */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* ========== ROOT LAYOUT ========== */
        .app-root {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #080b10;
          color: #e8eaed;
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @media (max-width: 1024px) {
          .app-root {
            height: auto;
            min-height: 100%;
            overflow: visible;
          }
        }

        /* ========== MAIN CONTENT AREA ========== */
        .app-main {
          flex: 1;
          display: grid;
          grid-template-columns: 300px 1fr 360px;
          gap: 24px;
          padding: 24px 48px;
          overflow: hidden;
          min-height: 0;
        }

        @media (max-width: 1280px) {
          .app-main {
            grid-template-columns: 280px 1fr 320px;
            gap: 20px;
            padding: 20px 32px;
          }
        }

        @media (max-width: 1024px) {
          .app-main {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px;
            overflow: visible;
          }
        }

        @media (max-width: 640px) {
          .app-main {
            gap: 12px;
            padding: 12px;
          }
        }

        /* ========== SCROLLABLE COLUMNS ========== */
        .column-left,
        .column-center,
        .column-right {
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .column-left,
          .column-center,
          .column-right {
            overflow: visible;
          }
          /* Keep natural flow: Scenarios -> Targets -> Results */
        }

        /* Custom scrollbars for internal scrollable areas */
        .scenario-buttons-container::-webkit-scrollbar,
        .target-list::-webkit-scrollbar {
          width: 6px;
        }

        .scenario-buttons-container::-webkit-scrollbar-track,
        .target-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .scenario-buttons-container::-webkit-scrollbar-thumb,
        .target-list::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }

        .scenario-buttons-container::-webkit-scrollbar-thumb:hover,
        .target-list::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        /* ========== HEADER ========== */
        .app-header {
          background: linear-gradient(135deg, #0f1419 0%, #080b10 50%, #0a1628 100%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding: 20px 48px;
          position: relative;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .app-header {
            padding: 16px;
          }
        }

        .app-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .app-header-content {
          position: relative;
          z-index: 1;
          max-width: 1504px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-left {
          flex: 1;
          min-width: 200px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .header-left {
            min-width: 100%;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
        }

        .app-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          color: #f8fafc;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .app-subtitle {
          color: #8b949e;
          margin-top: 6px;
          font-size: 13px;
          line-height: 1.4;
          max-width: 600px;
        }

        .brand-tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.1);
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 1024px) {
          .app-header {
            padding: 20px 16px;
          }
          .app-title {
            font-size: 20px;
          }
          .app-subtitle {
            font-size: 13px;
          }
        }

        @media (max-width: 640px) {
          .app-title {
            font-size: 18px;
            line-height: 1.3;
          }
          .app-subtitle {
            font-size: 12px;
            margin-top: 4px;
          }
        }

        /* ========== CARDS ========== */
        .card {
          background: linear-gradient(145deg, #12171f 0%, #0c1017 100%);
          border: 1px solid #1e2a3a;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease-out;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .card:last-child {
          margin-bottom: 0;
        }

        .card:hover {
          border-color: #2a3a4e;
        }

        .card-header {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #8b949e;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1e2a3a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-header::before {
          content: '';
          width: 3px;
          height: 14px;
          background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .card {
            padding: 16px;
          }
        }

        @media (max-width: 640px) {
          .card {
            padding: 14px;
            border-radius: 10px;
          }
        }

        /* ========== BUTTONS ========== */
        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 640px) {
          .btn {
            padding: 14px 20px;
            min-height: 48px;
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #94a3b8;
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary:hover:not(:disabled) {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
          color: #e2e8f0;
          border-color: #475569;
          transform: translateY(-1px);
        }

        .btn-success {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          border-color: #10b981;
        }

        .btn-scenario {
          background: transparent;
          color: #94a3b8;
          border: 1px solid #1e2a3a;
          text-align: left;
          padding: 12px 14px;
          width: 100%;
          margin-bottom: 8px;
          border-radius: 8px;
          position: relative;
        }

        .btn-scenario:last-child {
          margin-bottom: 0;
        }

        .btn-scenario:hover {
          border-color: #3b82f6;
          color: #e2e8f0;
          background: rgba(59, 130, 246, 0.05);
        }

        .btn-scenario.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border-color: #3b82f6;
          color: #60a5fa;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }

        .btn-scenario.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 0 2px 2px 0;
        }

        .scenario-name {
          font-weight: 500;
          margin-bottom: 3px;
          font-size: 13px;
        }

        .scenario-desc {
          font-size: 11px;
          opacity: 0.7;
          line-height: 1.35;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* ========== SCENARIO DROPDOWN (Mobile) ========== */
        .scenario-dropdown-container {
          display: none;
        }

        .scenario-buttons-container {
          display: block;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }

        @media (max-width: 1024px) {
          .scenario-dropdown-container {
            display: block;
          }
          .scenario-buttons-container {
            display: none;
          }
        }

        /* ========== SLIDERS ========== */
        .slider-container {
          margin: 16px 0;
        }

        .slider-container:first-of-type {
          margin-top: 0;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 400px) {
          .slider-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }

        .slider-label {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
          flex-shrink: 0;
        }

        .slider-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 16px;
          color: #60a5fa;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .slider-value-input {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          color: #60a5fa;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.1);
          padding: 4px 6px;
          border-radius: 6px;
          border: 1px solid transparent;
          width: 70px;
          min-width: 70px;
          max-width: 70px;
          text-align: right;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
          box-sizing: border-box;
        }

        .slider-value-input:hover {
          background: rgba(59, 130, 246, 0.15);
        }

        .slider-value-input:focus {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.2);
        }

        .slider-value-input::-webkit-inner-spin-button,
        .slider-value-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .slider-value-input[type=number] {
          -moz-appearance: textfield;
        }

        .slider-value-suffix {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 16px;
          color: #60a5fa;
          font-weight: 600;
          margin-left: 2px;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, #1e293b 0%, #334155 100%);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .slider:hover {
          background: linear-gradient(90deg, #334155 0%, #475569 100%);
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          cursor: pointer;
          border: 3px solid #60a5fa;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          cursor: pointer;
          border: 3px solid #60a5fa;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }

        @media (max-width: 640px) {
          .slider {
            height: 12px;
          }
          .slider::-webkit-slider-thumb {
            width: 28px;
            height: 28px;
          }
          .slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
          }
        }

        .slider-hints {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
          margin-top: 8px;
        }

        /* ========== SELECT INPUTS ========== */
        .select-input {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          color: #e2e8f0;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        .select-input:hover {
          border-color: #475569;
          background-color: #1e293b;
        }

        .select-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 640px) {
          .filter-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .select-input {
            padding: 14px 16px;
            min-height: 48px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* ========== TARGET LIST ========== */
        .target-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
          margin-right: -8px;
          min-height: 0;
        }

        .target-list::-webkit-scrollbar {
          width: 8px;
        }

        .target-list::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 4px;
        }

        .target-list::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
          border-radius: 4px;
        }

        .target-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #475569 0%, #334155 100%);
        }

        @media (max-width: 1024px) {
          .target-list {
            flex: none;
            max-height: none;
          }
        }

        .target-item {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #0f172a 0%, #0c1220 100%);
          border: 1px solid #1e293b;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .target-item:hover {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          transform: translateX(4px);
        }

        .target-item.selected {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
          border-color: #3b82f6;
          box-shadow: 0 0 24px rgba(59, 130, 246, 0.15), inset 0 0 0 1px rgba(59, 130, 246, 0.1);
        }

        .target-item.selected .target-name {
          color: #60a5fa;
        }

        .target-content {
          flex: 1;
          min-width: 0;
        }

        .target-name {
          font-weight: 500;
          margin-bottom: 6px;
          font-size: 14px;
          color: #e2e8f0;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .target-location {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .target-stats {
          text-align: right;
          flex-shrink: 0;
          margin-left: 16px;
        }

        .target-stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          font-weight: 500;
        }

        .target-stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 640px) {
          .target-item {
            flex-direction: column;
            padding: 14px;
          }
          .target-stats {
            text-align: left;
            margin-left: 34px;
            margin-top: 8px;
          }
          .target-item:hover {
            transform: none; /* Disable hover transform on mobile */
          }
        }

        /* ========== CHECKBOXES ========== */
        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #475569;
          border-radius: 5px;
          margin-right: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          transition: all 0.2s ease;
          background: #0f172a;
        }

        .checkbox.checked {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-color: #60a5fa;
          animation: checkmark 0.2s ease-out;
        }

        .checkbox svg {
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
        }

        .checkbox.checked svg {
          opacity: 1;
          transform: scale(1);
        }

        @media (max-width: 640px) {
          .checkbox {
            width: 24px;
            height: 24px;
          }
        }

        /* ========== TAGS ========== */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .tag-type {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .tag-region {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        /* ========== STAT BOXES ========== */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        @media (max-width: 640px) {
          .stat-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .stat-box {
            padding: 10px 4px;
          }
          .stat-value {
            font-size: 14px;
          }
          .stat-label {
            font-size: 9px;
          }
        }

        @media (max-width: 400px) {
          .stat-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .stat-box {
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
          .stat-value {
            font-size: 18px;
            margin-bottom: 0;
            order: 2;
          }
          .stat-label {
            font-size: 11px;
            order: 1;
          }
        }

        .stat-box {
          background: linear-gradient(145deg, #0f172a 0%, #0c1220 100%);
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 12px 6px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .stat-box:hover {
          border-color: #334155;
          transform: translateY(-1px);
        }

        .stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 18px;
          font-weight: 600;
          color: #60a5fa;
          margin-bottom: 4px;
          line-height: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-value-large {
          font-size: 20px;
        }

        .stat-value-red {
          color: #f87171;
        }

        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }

        /* ========== BREAKDOWN ROWS ========== */
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #1e293b;
          font-size: 14px;
          transition: background 0.15s ease;
          gap: 12px;
        }

        .breakdown-row:hover {
          background: rgba(59, 130, 246, 0.03);
          margin: 0 -12px;
          padding: 12px;
          border-radius: 6px;
        }

        .breakdown-row:last-child {
          border-bottom: none;
        }

        .breakdown-label {
          color: #94a3b8;
          flex: 1;
          min-width: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .breakdown-count {
          color: #64748b;
          font-size: 13px;
        }

        .breakdown-value {
          font-family: 'IBM Plex Mono', monospace;
          color: #60a5fa;
          font-weight: 500;
          flex-shrink: 0;
          white-space: nowrap;
        }

        @media (max-width: 400px) {
          .breakdown-row {
            flex-direction: column;
            gap: 4px;
          }
          .breakdown-value {
            margin-left: 0;
          }
        }

        /* ========== MODALS ========== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: linear-gradient(145deg, #12171f 0%, #0c1017 100%);
          border: 1px solid #1e2a3a;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: slideIn 0.25s ease-out;
        }

        .modal-content-wide {
          max-width: 1000px;
        }

        .modal-header {
          padding: 24px 28px;
          border-bottom: 1px solid #1e2a3a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .modal-body {
          padding: 28px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-body h4 {
          color: #f1f5f9;
          font-size: 16px;
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .modal-body h4:first-child {
          margin-top: 0;
        }

        .modal-body p {
          color: #94a3b8;
          line-height: 1.7;
          font-size: 14px;
        }

        .modal-body ul {
          color: #94a3b8;
          line-height: 1.8;
          font-size: 14px;
          padding-left: 20px;
        }

        .modal-body li {
          margin-bottom: 8px;
        }

        @media (max-width: 640px) {
          .modal-overlay {
            padding: 12px;
          }
          .modal-content {
            max-height: 90vh;
            border-radius: 12px;
          }
          .modal-header {
            padding: 16px;
          }
          .modal-body {
            padding: 16px;
          }
          .modal-title {
            font-size: 16px;
          }
        }

        /* ========== EXPORT TEXT ========== */
        .export-text {
          background: #080b10;
          border: 1px solid #1e2a3a;
          border-radius: 8px;
          padding: 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-wrap;
          color: #94a3b8;
          max-height: 400px;
          overflow-y: auto;
        }

        /* ========== INFO BOX ========== */
        .info-box {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 16px;
          border-radius: 10px;
          font-size: 13px;
          color: #8b949e;
          margin-top: 16px;
          line-height: 1.6;
          border: 1px solid #334155;
        }

        .info-box strong {
          color: #60a5fa;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .info-box {
            padding: 12px;
            font-size: 12px;
          }
        }

        /* ========== ATTRIBUTION ========== */
        .attribution {
          font-size: 11px;
          color: #64748b;
          text-align: center;
          padding-top: 14px;
          border-top: 1px solid #1e293b;
          margin-top: 16px;
          line-height: 1.6;
        }

        .attribution strong {
          color: #94a3b8;
          font-weight: 500;
        }

        .link {
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .link:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        /* ========== DEDUP NOTE ========== */
        .dedup-note {
          font-size: 12px;
          color: #fbbf24;
          margin-top: 12px;
          padding: 12px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(251, 191, 36, 0.2);
          line-height: 1.5;
        }

        /* ========== ACTION BUTTONS CONTAINER ========== */
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 640px) {
          .action-buttons {
            gap: 8px;
          }
          .action-buttons .btn {
            width: 100%;
          }
        }

        /* ========== COMPARISON MODAL ========== */
        .comparison-grid {
          display: grid;
          gap: 20px;
        }

        .comparison-card {
          background: linear-gradient(145deg, #0f172a 0%, #0c1220 100%);
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .comparison-card:hover {
          border-color: #334155;
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #1e293b;
        }

        .comparison-title {
          margin: 0;
          font-size: 15px;
          color: #f1f5f9;
          font-weight: 500;
        }

        .comparison-remove {
          background: transparent;
          border: none;
          color: #f87171;
          cursor: pointer;
          font-size: 20px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }

        .comparison-remove:hover {
          background: rgba(248, 113, 113, 0.1);
        }

        .comparison-stat {
          margin-bottom: 18px;
        }

        .comparison-stat-label {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .comparison-stat-value {
          font-size: 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
        }

        .comparison-stat-sub {
          font-size: 11px;
          color: #64748b;
        }

        .comparison-summary {
          margin-top: 28px;
          padding: 20px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 12px;
          border: 1px solid #334155;
        }

        .comparison-summary-title {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .comparison-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .comparison-summary-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .comparison-card {
            padding: 16px;
          }
          .comparison-stat-value {
            font-size: 22px;
          }
        }

        .summary-item-label {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .summary-item-value {
          font-size: 18px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
        }

        /* ========== TARGET COUNT ========== */
        .target-count {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: #0f172a;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .target-count-highlight {
          color: #60a5fa;
          font-weight: 500;
        }

        @media (max-width: 400px) {
          .target-count {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }

        /* ========== CUSTOM TARGET ========== */
        .custom-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          color: #fbbf24;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .delete-custom-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          color: #f87171;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.15s ease;
          opacity: 0;
        }

        .target-item:hover .delete-custom-btn {
          opacity: 1;
        }

        .delete-custom-btn:hover {
          background: rgba(248, 113, 113, 0.2);
          border-color: #f87171;
        }

        /* ========== CUSTOM TARGET FORM ========== */
        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .form-label .required {
          color: #f87171;
          margin-left: 2px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #1e2a3a;
        }

        @media (max-width: 640px) {
          .form-input {
            padding: 14px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
          .form-actions {
            flex-direction: column-reverse;
            gap: 10px;
          }
          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <div className="header-left">
            <h1 className="app-title">Venezuela Strike Displacement Scenario Builder</h1>
            <p className="app-subtitle">
              Model projected short-term civilian displacement from hypothetical U.S. strikes on Venezuelan military and strategic targets
            </p>
          </div>
          <div className="header-right">
            <span className="brand-tag">Niskanen Center</span>
            <button
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '12px' }}
              onClick={() => setShowMethodology(true)}
            >
              Methodology
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        
        {/* Left Column - Scenario Selection */}
        <div className="column-left">
          {/* Scrollable presets section */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', marginBottom: '16px' }}>
              <div className="card-header">Scenario Presets</div>

              {/* Mobile Dropdown */}
              <div className="scenario-dropdown-container">
                <select
                  className="select-input"
                  value={selectedScenario}
                  onChange={(e) => handleScenarioChange(e.target.value)}
                >
                  {Object.entries(SCENARIO_PRESETS).map(([key, scenario]) => (
                    <option key={key} value={key}>
                      {scenario.name}
                    </option>
                  ))}
                </select>
                {selectedScenario !== 'custom' && (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', lineHeight: '1.5' }}>
                    {SCENARIO_PRESETS[selectedScenario].description}
                  </p>
                )}
              </div>

              {/* Desktop Buttons - Scrollable */}
              <div className="scenario-buttons-container" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {Object.entries(SCENARIO_PRESETS).map(([key, scenario]) => (
                  <button
                    key={key}
                    className={`btn btn-scenario ${selectedScenario === key ? 'active' : ''}`}
                    onClick={() => handleScenarioChange(key)}
                  >
                    <div className="scenario-name">
                      {scenario.name}
                    </div>
                    <div className="scenario-desc">{scenario.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed parameters section */}
          <div style={{ flexShrink: 0 }}>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">Parameters</div>

            <div className="slider-container">
              <div className="slider-header">
                <span className="slider-label">Displacement Rate</span>
                <input
                  type="number"
                  className="slider-value-input"
                  min="0.001"
                  max="10"
                  step="any"
                  value={displacementRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0.001 && val <= 10) {
                      setDisplacementRate(val);
                    }
                  }}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val) || val < 0.001) setDisplacementRate(0.001);
                    else if (val > 10) setDisplacementRate(10);
                  }}
                />
                <span className="slider-value-suffix">%</span>
              </div>
              <input
                type="range"
                className="slider"
                min="0"
                max="100"
                step="0.1"
                value={((Math.log10(displacementRate) + 3) / 4) * 100}
                onChange={(e) => {
                  const sliderVal = parseFloat(e.target.value);
                  const actualVal = Math.pow(10, -3 + (sliderVal / 100) * 4);
                  // Round to appropriate decimal places based on magnitude
                  const decimals = actualVal < 0.01 ? 4 : actualVal < 0.1 ? 3 : actualVal < 1 ? 2 : 1;
                  setDisplacementRate(parseFloat(actualVal.toFixed(decimals)));
                }}
              />
              <div className="slider-hints">
                <span>0.001% (minimal)</span>
                <span>10% (major)</span>
              </div>
            </div>

            <div className="slider-container">
              <div className="slider-header">
                <span className="slider-label">Population Multiplier</span>
                <span className="slider-value">{populationMultiplier.toFixed(2)}x</span>
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
              <div className="slider-hints">
                <span>0.7x (emigration)</span>
                <span>1.2x (growth)</span>
              </div>
            </div>

            <div className="info-box">
              <strong>Displacement Rate:</strong> Default (0.001%) reflects minimal impact. Increase for larger strike intensity or broader evacuation scenarios.<br/><br/>
              <strong>Population Multiplier:</strong> Adjusts 2011 census data for population changes. Use &lt;1.0 to account for Venezuela's significant emigration since 2011, or &gt;1.0 if modeling areas with population growth.
            </div>
            </div>
          </div>
        </div>

        {/* Center Column - Target Selection */}
        <div className="column-center">
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {/* Fixed header section */}
            <div style={{ flexShrink: 0 }}>
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

              <div className="filter-grid">
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

              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginBottom: '12px' }}
                onClick={() => setShowCustomTargetModal(true)}
              >
                + Create Custom Target
              </button>

              <div className="target-count">
                <span>Showing <span className="target-count-highlight">{filteredTargets.length}</span> targets</span>
                <span><span className="target-count-highlight">{selectedTargets.length}</span> selected</span>
              </div>
            </div>

            {/* Scrollable target list */}
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
                    style={{ position: 'relative' }}
                  >
                    {target.isCustom && (
                      <button
                        className="delete-custom-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomTarget(target.customId);
                        }}
                        title="Delete custom target"
                      >
                        ×
                      </button>
                    )}
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="target-content">
                      <div className="target-name">
                        {target.name}
                        {target.isCustom && <span className="custom-badge" style={{ marginLeft: '8px' }}>Custom</span>}
                      </div>
                      <div className="target-location">
                        {target.municipality}, {target.state}
                      </div>
                      <div className="tags-container">
                        <span className="tag tag-type">{target.type}</span>
                        <span className="tag tag-region">{target.region}</span>
                      </div>
                    </div>
                    <div className="target-stats">
                      {isSelected ? (
                        <>
                          <div className="target-stat-value" style={{ color: '#60a5fa' }}>
                            {displaced.toLocaleString()}
                          </div>
                          <div className="target-stat-label">displaced</div>
                        </>
                      ) : (
                        <>
                          <div className="target-stat-value" style={{ color: '#64748b' }}>
                            {adjustedPop.toLocaleString()}
                          </div>
                          <div className="target-stat-label">population</div>
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
        <div className="column-right">
          {/* Fixed summary at top */}
          <div style={{ flexShrink: 0 }}>
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">Scenario Summary</div>

              <div className="stat-grid">
                <div className="stat-box">
                  <div className="stat-value">{calculations.deduplicatedCount}</div>
                  <div className="stat-label">Municipalities</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value stat-value-large">
                    {calculations.totalPop.toLocaleString()}
                  </div>
                  <div className="stat-label">Affected Pop.</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value stat-value-large stat-value-red">
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
          </div>

          {/* Scrollable breakdowns in middle */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">Breakdown by Type</div>
              {Object.entries(calculations.byType).length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '24px' }}>
                  No targets selected
                </div>
              ) : (
                Object.entries(calculations.byType)
                  .sort((a, b) => b[1].displaced - a[1].displaced)
                  .map(([type, data]) => (
                    <div key={type} className="breakdown-row">
                      <span>
                        <span className="breakdown-label">{type}</span>
                        <span className="breakdown-count"> ({data.count})</span>
                      </span>
                      <span className="breakdown-value">
                        {data.displaced.toLocaleString()}
                      </span>
                    </div>
                  ))
              )}
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">Breakdown by Region</div>
              {Object.entries(calculations.byRegion).length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '24px' }}>
                  No targets selected
                </div>
              ) : (
                Object.entries(calculations.byRegion)
                  .sort((a, b) => b[1].displaced - a[1].displaced)
                  .map(([region, data]) => (
                    <div key={region} className="breakdown-row">
                      <span>
                        <span className="breakdown-label">{region}</span>
                        <span className="breakdown-count"> ({data.count})</span>
                      </span>
                      <span className="breakdown-value">
                        {data.displaced.toLocaleString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Fixed action buttons at bottom */}
          <div style={{ flexShrink: 0, marginTop: '16px' }}>
            <div className="action-buttons">
            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={copyShareableUrl}
              disabled={selectedTargets.length === 0}
            >
              {linkCopied ? '✓ Link Copied!' : 'Share Scenario Link'}
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={exportToCSV}
              disabled={selectedTargets.length === 0}
            >
              Export to CSV
            </button>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowExport(true)}
              disabled={selectedTargets.length === 0}
            >
              Export Scenario Report
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={saveCurrentScenario}
              disabled={selectedTargets.length === 0}
            >
              Save for Comparison ({savedScenarios.length}/3)
            </button>

            {savedScenarios.length > 0 && (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setShowComparison(true)}
              >
                Compare Scenarios ({savedScenarios.length})
              </button>
            )}
            </div>

            <div className="attribution">
              <strong>Gil Guerra and Claire Holba</strong>, Niskanen Center<br/>
              Corrections & questions: <a href="mailto:gguerra@niskanencenter.org" className="link">gguerra@niskanencenter.org</a>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Export Scenario Report</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={copyToClipboard}>
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
              <h3 className="modal-title">Methodology & Limitations</h3>
              <button className="btn btn-secondary" onClick={() => setShowMethodology(false)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <h4>Data Sources</h4>
              <p>Population figures are derived from the 2011 Venezuelan census at the municipal level. The population multiplier allows adjustment for demographic changes since 2011, including Venezuela's significant emigration wave.</p>

              <h4>Displacement Calculation</h4>
              <p>Projected displacement = (Municipal Population × Population Multiplier) × Displacement Rate</p>
              <p>The default displacement rate of 0.001% reflects a minimal strike assumption. Users should adjust based on strike intensity, evacuation patterns, and conflict duration being modeled.</p>

              <h4>Deduplication</h4>
              <p>When multiple targets are selected within the same municipality, the affected population is counted only once to avoid double-counting. The highest population figure among overlapping targets is used.</p>

              <h4>Limitations</h4>
              <ul>
                <li><strong>Short-term only:</strong> This model estimates immediate/short-term displacement. Multi-year projections require additional modeling of conflict duration, economic collapse, and cascading effects.</li>
                <li><strong>No ripple effects:</strong> Secondary displacement from neighboring areas (people fleeing due to fear/instability rather than direct strikes) is not included.</li>
                <li><strong>Municipal-level granularity:</strong> Population is attributed at the municipal level; actual displacement patterns would vary based on precise strike locations within municipalities.</li>
                <li><strong>Census age:</strong> 2011 data may not reflect current population distribution, particularly in areas affected by internal migration.</li>
              </ul>

              <h4>Contact</h4>
              <p>For corrections, questions, or methodological inquiries: <a href="mailto:gguerra@niskanencenter.org" className="link">gguerra@niskanencenter.org</a></p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Target Modal */}
      {showCustomTargetModal && (
        <div className="modal-overlay" onClick={() => setShowCustomTargetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Custom Target</h3>
              <button className="btn btn-secondary" onClick={() => setShowCustomTargetModal(false)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Target Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Custom Military Base"
                    value={customTargetForm.name}
                    onChange={(e) => handleCustomTargetChange('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Municipality <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Libertador"
                    value={customTargetForm.municipality}
                    onChange={(e) => handleCustomTargetChange('municipality', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    State <span className="required">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={customTargetForm.state}
                    onChange={(e) => handleCustomTargetChange('state', e.target.value)}
                  >
                    <option value="">Select State...</option>
                    {ALL_STATES.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Population <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g., 50000"
                    min="1"
                    value={customTargetForm.population}
                    onChange={(e) => handleCustomTargetChange('population', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Type <span className="required">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={customTargetForm.type}
                    onChange={(e) => handleCustomTargetChange('type', e.target.value)}
                  >
                    <option value="">Select Type...</option>
                    <option value="Air Base">Air Base</option>
                    <option value="Army Fort">Army Fort</option>
                    <option value="Naval Port">Naval Port</option>
                    <option value="Drug Trafficking Region">Drug Trafficking Region</option>
                    <option value="Urban Center">Urban Center</option>
                    <option value="Air Defense Site">Air Defense Site</option>
                    <option value="Communications Site">Communications Site</option>
                    <option value="Radar Station">Radar Station</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Region <span className="required">*</span>
                  </label>
                  <select
                    className="form-input"
                    value={customTargetForm.region}
                    onChange={(e) => handleCustomTargetChange('region', e.target.value)}
                  >
                    <option value="">Select Region...</option>
                    {ALL_REGIONS.filter(r => r !== 'all').map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Additional information about this target..."
                  value={customTargetForm.notes}
                  onChange={(e) => handleCustomTargetChange('notes', e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCustomTargetModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCustomTargetSubmit}
                >
                  Create Target
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="modal-overlay" onClick={() => setShowComparison(false)}>
          <div className="modal-content modal-content-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Scenario Comparison</h3>
              <button className="btn btn-secondary" onClick={() => setShowComparison(false)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <div className="comparison-grid" style={{ gridTemplateColumns: `repeat(${Math.min(savedScenarios.length, 3)}, 1fr)` }}>
                {savedScenarios.map(scenario => (
                  <div key={scenario.id} className="comparison-card">
                    <div className="comparison-header">
                      <h4 className="comparison-title">{scenario.name}</h4>
                      <button
                        onClick={() => removeScenario(scenario.id)}
                        className="comparison-remove"
                      >
                        ×
                      </button>
                    </div>

                    <div className="comparison-stat">
                      <div className="comparison-stat-label">Parameters</div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        Rate: {scenario.displacementRate}% · Multiplier: {scenario.populationMultiplier.toFixed(2)}x
                      </div>
                    </div>

                    <div className="comparison-stat">
                      <div className="comparison-stat-label">Targets</div>
                      <div className="comparison-stat-value" style={{ color: '#60a5fa' }}>
                        {scenario.calculations.deduplicatedCount}
                      </div>
                      <div className="comparison-stat-sub">unique municipalities</div>
                    </div>

                    <div className="comparison-stat">
                      <div className="comparison-stat-label">Affected Population</div>
                      <div className="comparison-stat-value" style={{ color: '#60a5fa' }}>
                        {scenario.calculations.totalPop.toLocaleString()}
                      </div>
                    </div>

                    <div className="comparison-stat">
                      <div className="comparison-stat-label">Projected Displacement</div>
                      <div className="comparison-stat-value" style={{ color: '#f87171' }}>
                        {scenario.calculations.totalDisplaced.toLocaleString()}
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary"
                      style={{ width: '100%', marginTop: '8px' }}
                      onClick={() => loadScenario(scenario)}
                    >
                      Load This Scenario
                    </button>
                  </div>
                ))}
              </div>

              {savedScenarios.length >= 2 && (
                <div className="comparison-summary">
                  <div className="comparison-summary-title">Comparison Summary</div>
                  <div className="comparison-summary-grid">
                    <div>
                      <div className="summary-item-label">Lowest Displacement</div>
                      <div className="summary-item-value" style={{ color: '#6ee7b7' }}>
                        {Math.min(...savedScenarios.map(s => s.calculations.totalDisplaced)).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="summary-item-label">Highest Displacement</div>
                      <div className="summary-item-value" style={{ color: '#f87171' }}>
                        {Math.max(...savedScenarios.map(s => s.calculations.totalDisplaced)).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="summary-item-label">Difference</div>
                      <div className="summary-item-value" style={{ color: '#fbbf24' }}>
                        {(Math.max(...savedScenarios.map(s => s.calculations.totalDisplaced)) -
                          Math.min(...savedScenarios.map(s => s.calculations.totalDisplaced))).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
