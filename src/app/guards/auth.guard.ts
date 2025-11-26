import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional para proteger rutas que requieren autenticación
 * Uso: canActivate: [authGuard]
 */
export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirigir a login si no está autenticado
    console.warn('⚠️ Acceso denegado - Redirigiendo a login');
    router.navigate(['/login']);
    return false;
};
