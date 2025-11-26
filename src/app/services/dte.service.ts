import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dte } from '../models/dte.model';

@Injectable({
    providedIn: 'root'
})
export class DteService {
    private readonly endpoint = '/secured/dte';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todos los DTEs
     */
    getAllDtes(): Observable<Dte[]> {
        return this.apiService.get<Dte[]>(`${this.endpoint}/all`);
    }
}
