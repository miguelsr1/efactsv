/**
 * Item del dashboard de facturación
 */
export interface DashboardItem {
    idDashboard: number;
    idContribuyente: number;
    idFactura: number;
    abreviatura: string;        // "FE", "CCF", etc.
    numDocumento: string;
    nombreCompleto: string;
    correo: string;
    descripcion: string;        // "ENVIADO", "PENDIENTE", "RECHAZADO"
    estado: number;
    codigoDte: string;
    idEstablecimiento: number;
    idPuntoVenta: number;
    fechaCreacion: string;
    monto: number;
    idFormaPago: string;
    descripcionFormaPago: string;
}

/**
 * Estadísticas calculadas del dashboard
 */
export interface DashboardStats {
    totalFacturas: number;
    montoTotal: number;
    facturasPorEstado: { [key: string]: number };
    facturasPorTipo: { [key: string]: number };
    facturasPorMes: { mes: string; cantidad: number }[];
}

/**
 * Respuesta del endpoint de dashboard
 */
export interface DashboardResponse {
    success: boolean;
    data: DashboardItem[];
    message?: string;
}

/**
 * Montos facturados por período y tipo de DTE
 */
export interface InvoicedAmount {
    periodo: string;  // "HOY", "ESTA SEMANA", "ESTE MES", "ESTE AÑO"
    fe: number;
    ccf: number;
    nr: number;
    nc: number;
    nd: number;
    anu: number;
    fse: number;
}

/**
 * Balance de DTEs del plan
 */
export interface BalanceDte {
    limiteDte: number;    // Límite total del plan
    subTotal: number;     // DTEs generados
    pendiente: number;    // DTEs pendientes
}

/**
 * Item de facturación de últimos 7 días
 */
export interface InvoiceLast7DaysItem {
    id: number;
    fecha: string;
    cantidad: number;
    monto: number;
    codigoDte: string | null;
}
