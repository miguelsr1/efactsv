/**
 * Modelo de Factura Electrónica (DTE)
 */
export interface Factura {
    id?: string;
    numeroControl: string;
    codigoGeneracion: string;
    fechaEmision: string;
    cliente: Cliente;
    items: ItemFactura[];
    subtotal: number;
    iva: number;
    total: number;
    estado: EstadoFactura;
    selloRecibido?: string;
    fechaRecepcion?: string;
}

/**
 * Cliente de la factura
 */
export interface Cliente {
    nit?: string;
    nrc?: string;
    nombre: string;
    nombreComercial?: string;
    email: string;
    telefono?: string;
    direccion: Direccion;
}

/**
 * Dirección del cliente
 */
export interface Direccion {
    departamento: string;
    municipio: string;
    complemento: string;
}

/**
 * Item de la factura
 */
export interface ItemFactura {
    cantidad: number;
    descripcion: string;
    precioUnitario: number;
    ventaGravada: number;
    ventaExenta: number;
}

/**
 * Estados posibles de una factura
 */
export enum EstadoFactura {
    BORRADOR = 'BORRADOR',
    PROCESANDO = 'PROCESANDO',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA',
    ANULADA = 'ANULADA'
}

/**
 * Respuesta de la API al crear/actualizar factura
 */
export interface FacturaResponse {
    success: boolean;
    message: string;
    data?: Factura;
    errors?: string[];
}

/**
 * Parámetros de búsqueda de facturas
 */
export interface FacturaSearchParams {
    fechaInicio?: string;
    fechaFin?: string;
    estado?: EstadoFactura;
    cliente?: string;
    page?: number;
    limit?: number;
}

/**
 * Respuesta paginada de facturas
 */
export interface FacturaListResponse {
    success: boolean;
    data: Factura[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
