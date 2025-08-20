export type Status = 'Para Servicio' | 'Reserva' | 'Alternativa' | 'A Préstamo' | 'Fuera de Servicio';

export interface Truck {
  id: string;
  name: string;
  type?: string;
  zone: string;
  station: string;
  officer?: {
    hierarchy: string;
    name: string;
    lp: string;
  };
  personnel?: number;
  personnelList?: string[];
  status: Status;
}
