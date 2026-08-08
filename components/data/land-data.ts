export type LandListing = {
  /* =====================================================
     IDENTITY
  ====================================================== */

  id: string;

  title: string;

  location: string;

  area: string;

  landType: string;

  /* =====================================================
     REAL GEOGRAPHIC LOCATION
  ====================================================== */

  latitude?: number;

  longitude?: number;

  /* =====================================================
     3D PARCEL POSITION
  ====================================================== */

  position: [number, number];

  width: number;

  depth: number;

  /* =====================================================
     AI LAND INTELLIGENCE
  ====================================================== */

  bestUse: string;

  suitabilityScore: number;

  useScores: {
    warehouse: number;
    solarFarm: number;
    commercial: number;
    agriculture: number;
  };

  /* =====================================================
     FINANCIAL POTENTIAL
  ====================================================== */

  estimatedRevenue: string;

  estimatedValue: string;

  pricePerAcre: string;

  /* =====================================================
     CONNECTIVITY
  ====================================================== */

  highwayDistance: string;

  cityDistance: string;

  roadAccess: string;

  /* =====================================================
     INFRASTRUCTURE
  ====================================================== */

  electricity: boolean;

  water: boolean;

  internet: boolean;

  /* =====================================================
     LAND CHARACTERISTICS
  ====================================================== */

  terrain: string;

  soil: string;

  developmentDensity: string;

  solarExposure: string;

  /* =====================================================
     VERIFICATION
  ====================================================== */

  verified: boolean;

  verificationLevel: string;

  /* =====================================================
     HIGHLIGHTS
  ====================================================== */

  highlights: string[];
};

/* =========================================================
   LAND DATABASE
========================================================= */

export const landListings: LandListing[] = [

  /* =======================================================
     BLR-001
  ======================================================== */

  {
    id: "BLR-001",

    title:
      "Bengaluru Rural Estate",

    location:
      "Bengaluru Rural, Karnataka",

    area:
      "10.2 acres",

    landType:
      "Industrial",

    /* REAL LOCATION */

    latitude:
      13.1986,

    longitude:
      77.7066,

    /* CURRENT 3D POSITION */

    position: [
      -3.8,
      2.4,
    ],

    width:
      2.2,

    depth:
      1.6,

    /* AI */

    bestUse:
      "Warehouse",

    suitabilityScore:
      92,

    useScores: {
      warehouse: 92,
      solarFarm: 81,
      commercial: 78,
      agriculture: 64,
    },

    /* FINANCIAL */

    estimatedRevenue:
      "₹1.8L / month",

    estimatedValue:
      "₹8.4 Cr",

    pricePerAcre:
      "₹82.3L / acre",

    /* CONNECTIVITY */

    highwayDistance:
      "2.1 km",

    cityDistance:
      "8.4 km",

    roadAccess:
      "30 ft road",

    /* INFRASTRUCTURE */

    electricity:
      true,

    water:
      true,

    internet:
      true,

    /* LAND */

    terrain:
      "Gently rolling",

    soil:
      "Mixed red soil",

    developmentDensity:
      "Low",

    solarExposure:
      "High",

    /* VERIFICATION */

    verified:
      true,

    verificationLevel:
      "BhoomiSetu Verified",

    /* HIGHLIGHTS */

    highlights: [
      "2.1 km from highway",
      "30 ft road access",
      "Electricity available",
      "Water available",
      "Internet connectivity",
      "Low surrounding development",
    ],
  },

  /* =======================================================
     BLR-002
  ======================================================== */

  {
    id: "BLR-002",

    title:
      "Northern Solar Corridor",

    location:
      "Devanahalli, Karnataka",

    area:
      "14.6 acres",

    landType:
      "Renewable Energy",

    /* REAL LOCATION
       Will be connected to the
       Supabase coordinates later.
    */

    latitude:
      undefined,

    longitude:
      undefined,

    /* CURRENT 3D POSITION */

    position: [
      -0.8,
      2.8,
    ],

    width:
      1.8,

    depth:
      1.5,

    /* AI */

    bestUse:
      "Solar Farm",

    suitabilityScore:
      85,

    useScores: {
      warehouse: 72,
      solarFarm: 85,
      commercial: 68,
      agriculture: 74,
    },

    /* FINANCIAL */

    estimatedRevenue:
      "₹2.1L / month",

    estimatedValue:
      "₹10.2 Cr",

    pricePerAcre:
      "₹69.8L / acre",

    /* CONNECTIVITY */

    highwayDistance:
      "3.4 km",

    cityDistance:
      "12.7 km",

    roadAccess:
      "40 ft road",

    /* INFRASTRUCTURE */

    electricity:
      true,

    water:
      true,

    internet:
      true,

    /* LAND */

    terrain:
      "Flat",

    soil:
      "Red loam",

    developmentDensity:
      "Low",

    solarExposure:
      "Very high",

    /* VERIFICATION */

    verified:
      true,

    verificationLevel:
      "BhoomiSetu Verified",

    /* HIGHLIGHTS */

    highlights: [
      "High solar exposure",
      "Near transmission infrastructure",
      "Flat terrain",
      "Low surrounding development",
      "40 ft road access",
      "Electricity available",
    ],
  },

  /* =======================================================
     BLR-003
  ======================================================== */

  {
    id: "BLR-003",

    title:
      "Industrial Growth Parcel",

    location:
      "Hoskote, Karnataka",

    area:
      "8.7 acres",

    landType:
      "Commercial",

    /* REAL LOCATION
       Will be connected to the
       Supabase coordinates later.
    */

    latitude:
      undefined,

    longitude:
      undefined,

    /* CURRENT 3D POSITION */

    position: [
      2.5,
      1.7,
    ],

    width:
      2.4,

    depth:
      1.7,

    /* AI */

    bestUse:
      "Commercial",

    suitabilityScore:
      75,

    useScores: {
      warehouse: 82,
      solarFarm: 63,
      commercial: 75,
      agriculture: 55,
    },

    /* FINANCIAL */

    estimatedRevenue:
      "₹1.4L / month",

    estimatedValue:
      "₹7.1 Cr",

    pricePerAcre:
      "₹81.6L / acre",

    /* CONNECTIVITY */

    highwayDistance:
      "1.8 km",

    cityDistance:
      "15.2 km",

    roadAccess:
      "30 ft road",

    /* INFRASTRUCTURE */

    electricity:
      true,

    water:
      true,

    internet:
      true,

    /* LAND */

    terrain:
      "Gently sloped",

    soil:
      "Red loam",

    developmentDensity:
      "Medium",

    solarExposure:
      "High",

    /* VERIFICATION */

    verified:
      true,

    verificationLevel:
      "BhoomiSetu Verified",

    /* HIGHLIGHTS */

    highlights: [
      "Close to industrial zone",
      "Strong road connectivity",
      "Growing commercial corridor",
      "Electricity available",
      "Water available",
      "Internet connectivity",
    ],
  },

  /* =======================================================
     BLR-004
  ======================================================== */

  {
    id: "BLR-004",

    title:
      "Agricultural Opportunity",

    location:
      "Chikkaballapur, Karnataka",

    area:
      "18.4 acres",

    landType:
      "Agriculture",

    /* REAL LOCATION
       Will be connected to the
       Supabase coordinates later.
    */

    latitude:
      undefined,

    longitude:
      undefined,

    /* CURRENT 3D POSITION */

    position: [
      3.2,
      -1.7,
    ],

    width:
      2,

    depth:
      1.6,

    /* AI */

    bestUse:
      "Agriculture",

    suitabilityScore:
      68,

    useScores: {
      warehouse: 42,
      solarFarm: 71,
      commercial: 38,
      agriculture: 68,
    },

    /* FINANCIAL */

    estimatedRevenue:
      "₹95K / month",

    estimatedValue:
      "₹6.3 Cr",

    pricePerAcre:
      "₹34.2L / acre",

    /* CONNECTIVITY */

    highwayDistance:
      "6.2 km",

    cityDistance:
      "11.5 km",

    roadAccess:
      "Existing agricultural road",

    /* INFRASTRUCTURE */

    electricity:
      true,

    water:
      true,

    internet:
      false,

    /* LAND */

    terrain:
      "Gently rolling",

    soil:
      "Agricultural soil",

    developmentDensity:
      "Very low",

    solarExposure:
      "High",

    /* VERIFICATION */

    verified:
      true,

    verificationLevel:
      "BhoomiSetu Verified",

    /* HIGHLIGHTS */

    highlights: [
      "Water availability",
      "Suitable soil profile",
      "Existing agricultural access",
      "Low development density",
      "High solar exposure",
      "Electricity available",
    ],
  },
];