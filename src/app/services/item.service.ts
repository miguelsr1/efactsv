import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Item } from '../models/item.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private readonly endpoint = '/secured/item';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene todos los items
     */
    getAllItems(): Observable<Item[]> {
        return this.apiService.get<Item[]>(this.endpoint);
    }

    /**
     * Crea un nuevo item
     */
    createItem(item: Item): Observable<any> {
        return this.apiService.post(this.endpoint, item);
    }

    /**
     * Actualiza un item existente
     */
    updateItem(idProducto: number, item: Item): Observable<any> {
        return this.apiService.put(`${this.endpoint}/${idProducto}`, item);
    }
}
