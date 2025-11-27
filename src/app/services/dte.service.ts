import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dte, DteSearchParams } from '../models/dte.model';

@Injectable({
    providedIn: 'root'
})
export class DteService {
    private readonly endpoint = '/secured/dte';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todos los DTEs con filtros opcionales
     */
    getAllDtes(params?: DteSearchParams): Observable<Dte[]> {
        const queryParams: any = {};

        if (params) {
            if (params.correo) queryParams.correo = params.correo;
            if (params.fecha) queryParams.fecha = params.fecha;
            if (params.nombre) queryParams.nombre = params.nombre;
            if (params.numDocumento) queryParams.numDocumento = params.numDocumento;
        }

        return this.apiService.get<Dte[]>(`${this.endpoint}/all`, queryParams);
    }

    /**
     * Obtiene el reporte PDF de un DTE específico
     */
    getReportPdf(idFactura: number): Observable<{ pdf: string }> {
        return this.apiService.get<{ pdf: string }>(`${this.endpoint}/report/pdf/${idFactura}`);
    }

    /**
     * Obtiene el reporte JSON de un DTE específico
     */
    getReportJson(idFactura: number): Observable<{ json: any }> {
        return this.apiService.get<{ json: any }>(`${this.endpoint}/report/json/${idFactura}`);
    }
}
