export const WEIGHT_PER_ITEM_GRAM = 250;

export const COURIERS = [
  { code: 'jne', name: 'JNE REG' },
  { code: 'jnt', name: 'J&T Express' },
  { code: 'sicepat', name: 'SiCepat REG' },
  { code: 'jnt_cargo', name: 'J&T Kargo' },
];

export const PROVINCES = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau',
  'Jambi','Sumatera Selatan','Bangka Belitung','Bengkulu','Lampung',
  'DKI Jakarta','Jawa Barat','Banten','Jawa Tengah','DI Yogyakarta',
  'Jawa Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
  'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan',
  'Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Gorontalo',
  'Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara',
  'Maluku','Maluku Utara','Papua Barat','Papua',
  'Papua Selatan','Papua Tengah','Papua Pegunungan','Papua Barat Daya',
];

// Tarif per kg dari Sidoarjo (Rp)
const RATES: Record<string, Record<string, number>> = {
  // Jawa Timur
  'Jawa Timur':        { jne: 9000,  jnt: 9000,  sicepat: 8000,  jnt_cargo: 7000  },
  // Jawa lainnya + Banten
  'Jawa Tengah':       { jne: 13000, jnt: 12000, sicepat: 12000, jnt_cargo: 10000 },
  'DI Yogyakarta':     { jne: 13000, jnt: 12000, sicepat: 12000, jnt_cargo: 10000 },
  'Jawa Barat':        { jne: 16000, jnt: 15000, sicepat: 15000, jnt_cargo: 13000 },
  'DKI Jakarta':       { jne: 16000, jnt: 15000, sicepat: 15000, jnt_cargo: 13000 },
  'Banten':            { jne: 16000, jnt: 15000, sicepat: 15000, jnt_cargo: 13000 },
  // Bali & NTB
  'Bali':              { jne: 19000, jnt: 18000, sicepat: 18000, jnt_cargo: 15000 },
  'Nusa Tenggara Barat': { jne: 23000, jnt: 22000, sicepat: 22000, jnt_cargo: 19000 },
  'Nusa Tenggara Timur': { jne: 28000, jnt: 26000, sicepat: 26000, jnt_cargo: 23000 },
  // Sumatera
  'Lampung':           { jne: 22000, jnt: 21000, sicepat: 21000, jnt_cargo: 18000 },
  'Sumatera Selatan':  { jne: 24000, jnt: 22000, sicepat: 22000, jnt_cargo: 19000 },
  'Bangka Belitung':   { jne: 25000, jnt: 23000, sicepat: 23000, jnt_cargo: 20000 },
  'Bengkulu':          { jne: 25000, jnt: 23000, sicepat: 23000, jnt_cargo: 20000 },
  'Jambi':             { jne: 25000, jnt: 23000, sicepat: 23000, jnt_cargo: 20000 },
  'Riau':              { jne: 26000, jnt: 24000, sicepat: 24000, jnt_cargo: 21000 },
  'Kepulauan Riau':    { jne: 27000, jnt: 25000, sicepat: 25000, jnt_cargo: 22000 },
  'Sumatera Barat':    { jne: 26000, jnt: 24000, sicepat: 24000, jnt_cargo: 21000 },
  'Sumatera Utara':    { jne: 27000, jnt: 25000, sicepat: 25000, jnt_cargo: 22000 },
  'Aceh':              { jne: 29000, jnt: 27000, sicepat: 27000, jnt_cargo: 24000 },
  // Kalimantan
  'Kalimantan Barat':  { jne: 28000, jnt: 26000, sicepat: 26000, jnt_cargo: 23000 },
  'Kalimantan Tengah': { jne: 29000, jnt: 27000, sicepat: 27000, jnt_cargo: 24000 },
  'Kalimantan Selatan':{ jne: 28000, jnt: 26000, sicepat: 26000, jnt_cargo: 23000 },
  'Kalimantan Timur':  { jne: 29000, jnt: 27000, sicepat: 27000, jnt_cargo: 24000 },
  'Kalimantan Utara':  { jne: 31000, jnt: 29000, sicepat: 29000, jnt_cargo: 26000 },
  // Sulawesi
  'Sulawesi Utara':    { jne: 30000, jnt: 28000, sicepat: 28000, jnt_cargo: 25000 },
  'Gorontalo':         { jne: 30000, jnt: 28000, sicepat: 28000, jnt_cargo: 25000 },
  'Sulawesi Tengah':   { jne: 30000, jnt: 28000, sicepat: 28000, jnt_cargo: 25000 },
  'Sulawesi Barat':    { jne: 30000, jnt: 28000, sicepat: 28000, jnt_cargo: 25000 },
  'Sulawesi Selatan':  { jne: 30000, jnt: 28000, sicepat: 28000, jnt_cargo: 25000 },
  'Sulawesi Tenggara': { jne: 31000, jnt: 29000, sicepat: 29000, jnt_cargo: 26000 },
  // Maluku & Papua
  'Maluku':            { jne: 40000, jnt: 38000, sicepat: 38000, jnt_cargo: 35000 },
  'Maluku Utara':      { jne: 40000, jnt: 38000, sicepat: 38000, jnt_cargo: 35000 },
  'Papua Barat':       { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
  'Papua':             { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
  'Papua Selatan':     { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
  'Papua Tengah':      { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
  'Papua Pegunungan':  { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
  'Papua Barat Daya':  { jne: 46000, jnt: 44000, sicepat: 44000, jnt_cargo: 40000 },
};

export function calculateShipping(
  province: string,
  courierCode: string,
  totalItems: number
): number {
  const weightGram = totalItems * WEIGHT_PER_ITEM_GRAM;
  const weightKg = Math.max(1, Math.ceil(weightGram / 1000));
  const rate = RATES[province]?.[courierCode] ?? RATES['Jawa Timur'][courierCode] ?? 9000;
  return rate * weightKg;
}
