import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

/**
 * Interceptor HTTP funcional para:
 * - Agregar headers comunes
 * - Agregar token de autenticación automáticamente
 * - Logging de peticiones
 * - Manejo de errores global
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const startTime = Date.now();

    // Obtener token de localStorage
    const token = localStorage.getItem('access_token');

    // URLs que NO necesitan token (endpoints públicos)
    const publicUrls = ['/security/login', '/security/register', '/security/forgot-password'];
    const isPublicUrl = publicUrls.some(url => req.url.includes(url));

    // Preparar headers
    const headers: { [key: string]: string } = {
        'X-App-Version': environment.version,
        'X-Requested-With': 'XMLHttpRequest'
    };

    // Agregar token de autorización si existe y no es URL pública
    if (token && !isPublicUrl) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Clonar la petición con todos los headers de una vez
    const modifiedReq = req.clone({
        setHeaders: headers
    });

    // Log de inicio de petición (solo en desarrollo)
    if (environment.logging.enableConsole && environment.logging.level === 'debug') {
        console.log('🔵 HTTP Request:', {
            method: req.method,
            url: req.url,
            hasToken: !!token && !isPublicUrl,
            headers: modifiedReq.headers.keys(),
            body: req.body
        });
    }

    // Ejecutar la petición
    return next(modifiedReq).pipe(
        catchError((error) => {
            // Log de error
            if (environment.logging.enableConsole) {
                console.error('🔴 HTTP Error:', {
                    method: req.method,
                    url: req.url,
                    status: error.status,
                    message: error.message,
                    error: error.error
                });
            }

            // Manejo específico de errores
            if (error.status === 401) {
                console.warn('⚠️ Token inválido o expirado - Redirigiendo a login');

                // Limpiar tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_data');

                // Redirigir a login solo si no estamos ya en login
                if (!router.url.includes('/login')) {
                    router.navigate(['/login']);
                }
            }

            if (error.status === 403) {
                console.warn('⚠️ Acceso prohibido - Sin permisos suficientes');
            }

            if (error.status === 0) {
                console.error('❌ Error de red - Servidor no disponible');
            }

            return throwError(() => error);
        }),
        finalize(() => {
            // Log de finalización (solo en debug)
            if (environment.logging.enableConsole && environment.logging.level === 'debug') {
                const duration = Date.now() - startTime;
                console.log(`✅ HTTP Complete: ${req.method} ${req.url} (${duration}ms)`);
            }
        })
    );
};
