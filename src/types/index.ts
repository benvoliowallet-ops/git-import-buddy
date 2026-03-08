// ─── Stock Item ──────────────────────────────────────────────────────────────
export interface StockItem {
  code: string;
  name: string;
  additionalText: string;
  price: number;
  group: string;
  supplier?: string;        // 'NORMIST' | 'LOCAL' | other – from Supabase dodavatel column
}

// ─── Bracket BOM (from concurrent-pipe CAD analysis) ─────────────────────────
export interface BracketBOMLine {
  code: string;
  name: string;
  qty: number;
  slots: 2 | 4 | 6;
  direction: 'trellis' | 'racmet';
}

/** An interval where ≥2 pipe segments overlap in SVG coordinate space */
export interface ConcurrentInterval {
  axisCoord: number;  // shared Y for horizontal groups, shared X for vertical groups
  start: number;      // interval start along the perpendicular axis
  end: number;        // interval end along the perpendicular axis
  count: number;      // number of pipes active in this interval
  direction: 'H' | 'V';
}

// ─── Nozzle Combination ───────────────────────────────────────────────────────
export interface NozzleCombo {
  orifice: 0.15 | 0.20 | 0.25 | 0.30;
  nozzleCode: string;
  spacingCm: number;
  numNozzles: number;
  qActualMlH: number;
  coveragePct: number;
  pressure: number;         // bar
}

// ─── Project ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  quoteNumber: string;
  customerName: string;
  projectAddress: string;
  country: 'SK' | 'CZ' | 'HU';
  quoteDate: string;
  contactPerson: string;
  phone: string;
  email: string;
}

// ─── Global Parameters ───────────────────────────────────────────────────────
export interface GlobalParams {
  numberOfZones: number;
  fogCapacity: number;        // ml/hod/m² – K_fog
  systemPressure: number;     // bar
  pumpLocation: 'POTVRDENÉ' | 'NÁVRH';
  osmoticWater: boolean;
  steelRope: 'SS_NEREZ' | 'OCEĽ';
}

// ─── Zone Parameters ─────────────────────────────────────────────────────────
export interface ZoneParams {
  name: string;               // User label, e.g. "Sever A"
  length: number;             // L_lode [m]
  width: number;              // S_lode [m]
  height: number;             // V [m]
  numNaves: number;           // N_lodi
  trellisPitch: number;       // R_krat [m]
  controlType: 'Snímač' | 'Priva';
  hasMagnet: boolean;
  elevation: number;          // P_výš [ks]
  elevationLength: number;    // dĺžka prevýšenia [m] – pripočíta sa k inox potrubie
  hydraulicHoseEnabled: boolean; // YES/NO toggle
  hydraulicHoseLength: number; // [m]
  hydraulicHoseConnectors: number; // [ks]
  connectionType: 'T-kus' | 'rovny-spoj'; // prepoj na napájacie potrubie
  nozzleOrifice: 0.15 | 0.20 | 0.25 | 0.30; // mm
  nozzleFlow: number;         // Q_tryska [l/min]
  nozzleSpacing: 200 | 250 | 300 | 350 | 400 | 450 | 500; // cm
}

// ─── Zone Calculations ───────────────────────────────────────────────────────
export interface ZoneCalc {
  zoneIndex: number;
  area: number;               // m²
  zoneFlow: number;           // ml/hod
  numNozzles: number;
  nozzlesPerNave: number;     // geometry-based (75cm wall offset rule)
  numSwivel: number;
  numPipes10mm: number;       // per nave
  numPipes10mmTotal: number;
  numFitting180: number;
  numEndPlug: number;
  ropeLength: number;         // m (rounded to 500)
  ropeWaste: number;          // m wasted (ropeLength - ropeRaw)
  numHangers: number;
  numGripple: number;
  numNozzleHangers: number;
  numPipeHangers: number;
  // 3E brackets (filled after CAD)
  bracketsTrellis: number;
  bracketsRacmet: number;
  // 3F inox pipes (from CAD)
  inoxPipeLength: number;
  numInoxConnectors: number;
  numTJunctions: number;
  // 3H Darcy-Weisbach
  supplyPipeLength: number;   // from CAD
  velocity: number;           // m/s
  pressureDrop: number;       // bar
  // 3I dilations
  numDilations: number;
  dilationPoints: { x: number; y: number; type: 'bend' | '80m' }[];
  // 3J electrical
  cysyLength: number;
  numJunctionBoxes: number;
  numWago: number;
  // 3K drain
  numDrainAssemblies: number;
  numNeedleValves: number;
  // Drawing complete flag
  drawingComplete: boolean;
}

// ─── CAD Drawing ─────────────────────────────────────────────────────────────
export type LineType = 'pipe' | 'cable_cysy' | 'cable_ftp';

export interface CADPoint {
  x: number;
  y: number;
}

export interface CADSegment {
  id: string;
  zoneIndex: number;
  lineType: LineType;
  start: CADPoint;
  end: CADPoint;
}

export interface CADZone {
  zoneIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;         // when true, zone cannot be dragged on canvas
}

export interface CADSymbol {
  id: string;
  type: 'pump' | 'drain_magnet' | 'sensor';
  x: number;
  y: number;
  zoneIndex?: number;
}

export interface CADDrawing {
  zones: CADZone[];
  segments: CADSegment[];
  symbols: CADSymbol[];
  scale: number;              // pixels per meter
}

// ─── Pump ────────────────────────────────────────────────────────────────────
export interface PumpSelection {
  code: string;
  name: string;
  quantity: number;
  totalFlow: number;          // lpm
}

// ─── ETNA Station ────────────────────────────────────────────────────────────
export interface ETNAConfig {
  capacityM3h: number;
  maxivarem: string;          // code
  maxivareVariant: 'SS' | 'STANDARD';
  etnaFilter: string;
  etnaFilterVariant: 'SS' | 'STANDARD';
  normistPrice: number;       // manual input after NAZLI CP
  etnaAccessoryDistance: number; // m
  etnaAccessoryCost: number;  // €
}

// ─── Costs ───────────────────────────────────────────────────────────────────
export interface CostInputs {
  // 6A Labour
  installTechDays: number;
  installTechCount: number;
  installGreenhouseDays: number;
  installGreenhouseCount: number;
  diggingDays: number;
  diggingCount: number;
  commissioningDays: number;
  commissioningCount: number;
  inspectionFixed: number;    // 200
  designFixed: number;        // 200
  projectArea: number;        // ha → determines PM cost
  // 6B Transport
  salesTrips: number;
  techTrips: number;
  implTeamTrips: number;
  accommodationNights: number;
  accommodationTechs: number;
  mountingMaterial: 500 | 750 | 1000 | 1500;
  mountingMaterialStation: 500 | 750 | 1000 | 1500;
}

// ─── Saved Project (Dashboard) ───────────────────────────────────────────────
export interface SavedProject {
  id: string;
  savedAt: string;           // ISO datetime
  quoteNumber: string;
  customerName: string;
  projectAddress: string;
  country: string;
  currentStep: number;
  numZones: number;
  snapshot: ProjectState;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  passwordHash: string;
  createdAt: string;
}

export interface Invitation {
  code: string;         // 8-char random code
  email: string;        // pre-assigned email (can be empty '')
  role: 'admin' | 'user';
  createdBy: string;    // userId of admin
  createdAt: string;
  expiresAt: string;    // +7 days
  usedAt?: string;
  usedBy?: string;      // userId who registered
}

// ─── Change Log ───────────────────────────────────────────────────────────────
export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  itemCode: string;
  itemName: string;
  before?: Partial<StockItem>;
  after?: Partial<StockItem>;
}

// ─── Full Project State ───────────────────────────────────────────────────────
export interface ProjectState {
  currentStep: number;
  project: Project;
  globalParams: GlobalParams;
  zones: ZoneParams[];
  zoneCalcs: ZoneCalc[];
  cad: CADDrawing;
  pumpSelection: PumpSelection | null;
  etnaConfig: Partial<ETNAConfig>;
  normistPrice: number;
  costInputs: CostInputs;
  uvSystemCode: string | null;  // null = no UV; code = selected UV item
  ssFilter30: boolean;
  activeZoneIndex: number;
}
