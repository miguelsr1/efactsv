import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
    Factura,
    FacturaResponse,
    FacturaListResponse,
    FacturaSearchParams
} from '../models/factura.model';

/**
 * Servicio para gestión de Facturas Electrónicas (DTE)
 */
@Injectable({
    providedIn: 'root'
})
export class FacturaService {
    private readonly endpoint = '/facturas';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todas las facturas con filtros opcionales
     * @param params - Parámetros de búsqueda
     */
    getFacturas(params?: FacturaSearchParams): Observable<FacturaListResponse> {
        const queryParams: any = {};

        if (params) {
            if (params.fechaInicio) queryParams.fechaInicio = params.fechaInicio;
            if (params.fechaFin) queryParams.fechaFin = params.fechaFin;
            if (params.estado) queryParams.estado = params.estado;
            if (params.cliente) queryParams.cliente = params.cliente;
            if (params.page) queryParams.page = params.page.toString();
            if (params.limit) queryParams.limit = params.limit.toString();
        }

        return this.apiService.get<FacturaListResponse>(this.endpoint, queryParams);
    }

    /**
     * Obtiene una factura por su ID
     * @param id - ID de la factura
     */
    getFacturaById(id: string): Observable<Factura> {
        return this.apiService.get<FacturaResponse>(`${this.endpoint}/${id}`)
            .pipe(
                map(response => {
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Error al obtener factura');
                    }
                    return response.data;
                })
            );
    }

    /**
     * Crea una nueva factura
     * @param factura - Datos de la factura a crear
     */
    createFactura(factura: Partial<Factura>): Observable<Factura> {
        return this.apiService.post<FacturaResponse>(this.endpoint, factura)
            .pipe(
                map(response => {
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Error al crear factura');
                    }
                    return response.data;
                })
            );
    }

    /**
     * Actualiza una factura existente
     * @param id - ID de la factura
     * @param factura - Datos actualizados
     */
    updateFactura(id: string, factura: Partial<Factura>): Observable<Factura> {
        return this.apiService.put<FacturaResponse>(`${this.endpoint}/${id}`, factura)
            .pipe(
                map(response => {
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Error al actualizar factura');
                    }
                    return response.data;
                })
            );
    }

    /**
     * Elimina una factura
     * @param id - ID de la factura a eliminar
     */
    deleteFactura(id: string): Observable<boolean> {
        return this.apiService.delete<FacturaResponse>(`${this.endpoint}/${id}`)
            .pipe(
                map(response => response.success)
            );
    }

    /**
     * Envía una factura al Ministerio de Hacienda
     * @param id - ID de la factura
     */
    enviarAHacienda(id: string): Observable<Factura> {
        return this.apiService.post<FacturaResponse>(`${this.endpoint}/${id}/enviar`, {})
            .pipe(
                map(response => {
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Error al enviar factura');
                    }
                    return response.data;
                })
            );
    }

    /**
     * Anula una factura
     * @param id - ID de la factura
     * @param motivo - Motivo de anulación
     */
    anularFactura(id: string, motivo: string): Observable<Factura> {
        return this.apiService.post<FacturaResponse>(`${this.endpoint}/${id}/anular`, { motivo })
            .pipe(
                map(response => {
                    if (!response.success || !response.data) {
                        throw new Error(response.message || 'Error al anular factura');
                    }
                    return response.data;
                })
            );
    }

    /**
     * Descarga el PDF de una factura
     * @param id - ID de la factura
     */
    descargarPDF(id: string): Observable<Blob> {
        // Nota: Este método requeriría una implementación especial para manejar Blobs
        // Por ahora retorna la URL para descargar
        const url = `${this.endpoint}/${id}/pdf`;
        return this.apiService.get<Blob>(url);
    }
}
