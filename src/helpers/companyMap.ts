// Mapeo de números de cliente y grupo por empresa

// Función para normalizar nombres de empresas
export const normalizeCompanyName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Eliminar caracteres especiales
    .trim();
};

// Mapeo de nombres normalizados a nombres exactos
export const companyNameMap: Record<string, string> = {
  alianzaelectrica: 'Alianza Electrica',
  fgelectrical: 'Fg Electrical',
  tablerosyarrancadores: 'Tableros y Arrancadores',
  fgmanufacturing: 'FG Manufacturing',
  fge: 'Fg Electrical',
  tya: 'Tableros y Arrancadores',
  fgm: 'FG Manufacturing',
};

export const companyClientGroupMap: Record<
  string,
  { cliente: string; grupo: string }
> = {
  'Alianza Electrica': {
    cliente: '044216455',
    grupo: '125897',
  },
  'Fg Electrical': {
    cliente: '036310209',
    grupo: '124811',
  },
  'Tableros y Arrancadores': {
    cliente: '044217909',
    grupo: '129385',
  },
  'FG Manufacturing': {
    cliente: '044217909',
    grupo: '127394',
  },
};
