export interface Dte {
    idFactura: number;
    abrevDte: string;
    tipoDte: string;
    numDocumento: string | null;
    nombre: string;
    correo: string;
    fechaCreacion: string;
    codigoGeneracion: string;
    selloRecibido: string;
    estadoDescripcion: string;
    observaciones: string;
    estado: number;
    codigoDte: string;
    idEstablecimiento: number;
    idPuntoVenta: number;
}

export interface DteSearchParams {
    correo?: string;
    fecha?: string;
    nombre?: string;
    numDocumento?: string;
}

export interface InvalidateInfo {
    codigoGeneracion: string;
    selloRecibido: string;
    nombreDte: string;
    total: number;
    fechaProcesamiento: string;
}

export interface InvalidateRequest {
    idFactura: number;
}

