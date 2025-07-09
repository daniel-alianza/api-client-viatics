import { api } from './api';

interface Traslado {
  base: number;
  impuesto: string;
  tipoFactor: string;
  tasaOCuota: number | null;
  importe: number | null;
}

interface Concepto {
  claveProdServ: string;
  noIdentificacion: string;
  cantidad: number;
  claveUnidad: string;
  unidad: string;
  descripcion: string;
  valorUnitario: number;
  importe: number;
  descuento: number;
  objetoImp: string;
  traslados: Traslado[];
}

interface EmisorReceptor {
  rfc: string;
  regimenFiscal: string;
  regimenFiscalDescripcion: string;
  usoCFDI?: string;
  usoCFDIDescripcion?: string;
}

interface Impuestos {
  retenidos: number;
  traslados: number;
}

interface XmlInfoResponse {
  fechaEmision: string;
  total: number;
  lugarExpedicion: string;
  emisor: EmisorReceptor;
  receptor: EmisorReceptor;
  conceptos: Concepto[];
  folioFiscal: string;
  formaPago: string;
  formaPagoLetra: string;
  metodoPago: string;
  metodoPagoLetra: string;
  impuestos: Impuestos;
}

const xmlInfoService = {
  async getXmlInfo(movementId: number): Promise<XmlInfoResponse> {
    try {
      const response = await api.get(`/xml/comprobacion/${movementId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching XML info:', error);
      throw error;
    }
  },
};

export default xmlInfoService;
