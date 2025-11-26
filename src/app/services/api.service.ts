import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Servicio base para todas las peticiones HTTP
 * Proporciona métodos genéricos para GET, POST, PUT, DELETE
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiUrl = environment.api.baseUrl;
    private readonly apiTimeout = environment.api.timeout;

    constructor(private http: HttpClient) {
        if (environment.logging.enableConsole) {
            console.log('🚀 ApiService initialized with URL:', this.apiUrl);
        }
    }

    /**
     * Realiza una petición GET
     * @param endpoint - Endpoint de la API (ej: '/facturas')
     * @param params - Parámetros de query opcionales
     */
    get<T>(endpoint: string, params?: HttpParams | { [key: string]: string | string[] }): Observable<T> {
        const url = `${this.apiUrl}${endpoint}`;
        this.logRequest('GET', url, params);

        return this.http.get<T>(url, { params })
            .pipe(
                timeout(this.apiTimeout),
                catchError(this.handleError)
            );
    }

    /**
     * Realiza una petición POST
     * @param endpoint - Endpoint de la API
     * @param data - Datos a enviar en el body
     */
    post<T>(endpoint: string, data: any): Observable<T> {
        const url = `${this.apiUrl}${endpoint}`;
        this.logRequest('POST', url, data);

        return this.http.post<T>(url, data, { headers: this.getHeaders() })
            .pipe(
                timeout(this.apiTimeout),
                catchError(this.handleError)
            );
    }

    /**
     * Realiza una petición PUT
     * @param endpoint - Endpoint de la API
     * @param data - Datos a actualizar
     */
    put<T>(endpoint: string, data: any): Observable<T> {
        const url = `${this.apiUrl}${endpoint}`;
        this.logRequest('PUT', url, data);

        return this.http.put<T>(url, data, { headers: this.getHeaders() })
            .pipe(
                timeout(this.apiTimeout),
                catchError(this.handleError)
            );
    }

    /**
     * Realiza una petición DELETE
     * @param endpoint - Endpoint de la API
     */
    delete<T>(endpoint: string): Observable<T> {
        const url = `${this.apiUrl}${endpoint}`;
        this.logRequest('DELETE', url);

        return this.http.delete<T>(url, { headers: this.getHeaders() })
            .pipe(
                timeout(this.apiTimeout),
                catchError(this.handleError)
            );
    }

    /**
     * Obtiene los headers por defecto
     */
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    /**
     * Maneja errores de HTTP
     */
    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;

            // Mensajes específicos según el código de error
            switch (error.status) {
                case 400:
                    errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
                    break;
                case 401:
                    errorMessage = 'No autorizado. Inicia sesión nuevamente.';
                    break;
                case 403:
                    errorMessage = 'Acceso prohibido. No tienes permisos.';
                    break;
                case 404:
                    errorMessage = 'Recurso no encontrado.';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor. Intenta más tarde.';
                    break;
                case 503:
                    errorMessage = 'Servicio no disponible. Intenta más tarde.';
                    break;
            }
        }

        if (environment.logging.enableConsole) {
            console.error('❌ Error en petición HTTP:', errorMessage, error);
        }

        return throwError(() => new Error(errorMessage));
    };

    /**
     * Log de peticiones (solo en desarrollo)
     */
    private logRequest(method: string, url: string, data?: any): void {
        if (environment.logging.enableConsole && environment.logging.level === 'debug') {
            console.log(`📡 ${method} ${url}`, data || '');
        }
    }
}
