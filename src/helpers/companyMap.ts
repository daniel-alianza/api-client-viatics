// Mapeo de números de cliente y grupo por empresa

export const companyClientGroupMap: Record<
  string,
  { cliente: string; grupo: string }
> = {
  'Alianza Electrica': {
    cliente: '044216455',
    grupo: '125897',
  },
  fge: {
    cliente: '036310209',
    grupo: '124811',
  },
  'TYA (tableros y arrancadores)': {
    cliente: '044217909',
    grupo: '129385',
  },
  FGM: {
    cliente: '044217909',
    grupo: '127394',
  },
};
