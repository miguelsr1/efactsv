import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InvalidateInfo, InvalidateRequest } from '../models/dte.model';

@Injectable({
    providedIn: 'root'
})
export class InvalidateService {
    private readonly endpoint = '/secured/invalidate';

    constructor(private apiService: ApiService) { }


    /**
     * Obtiene la información para anular un DTE
     */
    getInvalidateInfo(idFactura: number): Observable<InvalidateInfo> {
        return this.apiService.get<InvalidateInfo>(`${this.endpoint}/${idFactura}`);
    }

    /**
     * Anula un DTE
     */
    invalidateDte(request: InvalidateRequest): Observable<any> {
        return this.apiService.post(`${this.endpoint}/`, request);
    }
}
