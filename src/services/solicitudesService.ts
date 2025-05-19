export interface Viatico {
  IdViaticos: number;
  Email: string;
  FechaSolicitud: string;
  Sociedad: string;
  Estado: string;
  MotivoSolicitud: string;
  CantidadTotal: number;
  FechaSalida: string;
  FechaRegreso: string;
  Area: string;
  Sucursal: string;
  NumTarjeta: string;
  JefeDirecto: string;
  AutorizadoPor: string;
  RevisadoPor: string;
  FechaAutorizacion: string;
  FechaRevision: string;
  FechaDispersion: string;
  Comentarios: string;
  ComentariosAutorizacion: string;
  ComentariosRevision: string;
  Transporte: number;
  Casetas: number;
  Hospedaje: number;
  Alimentos: number;
  Fletes: number;
  Herramientas: number;
  EnviosMensajeria: number;
  Diversos: number;
}

export interface ViaticoResponse {
  status: 'success' | 'error';
  message: string;
  data?: Viatico[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
  timestamp: string;
}

export const solicitudesService = {
  async getViaticosPorEmail(email: string): Promise<ViaticoResponse> {
    try {
      console.log('Llamando a la API con email:', email);
      const response = await fetch(
        `http://localhost:4000/viaticos?email=${encodeURIComponent(
          email,
        )}&limit=15`,
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener viáticos:', error);
      throw error;
    }
  },
};
