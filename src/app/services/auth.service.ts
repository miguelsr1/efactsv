import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

/**
 * Servicio de Autenticación
 * Maneja login, logout, almacenamiento de tokens y estado de autenticación
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'user_data';

    // Observable para saber si el usuario está autenticado
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Observable para el usuario actual
    private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) {
        if (environment.logging.enableConsole) {
            console.log('🔐 AuthService initialized');
        }
    }

    /**
     * Realiza el login
     * @param credentials - Usuario y contraseña
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.apiService.post<LoginResponse>('/security/login', credentials)
            .pipe(
                tap(response => {
                    // Guardar tokens en localStorage
                    this.setToken(response.access_token);
                    this.setRefreshToken(response.refresh_token);

                    // Guardar información del usuario (extraída del token o de la respuesta)
                    const user: User = {
                        username: credentials.username
                        // Aquí podrías decodificar el JWT para obtener más info
                    };
                    this.setUser(user);

                    // Actualizar estado de autenticación
                    this.isAuthenticatedSubject.next(true);
                    this.currentUserSubject.next(user);

                    if (environment.logging.enableConsole) {
                        console.log('✅ Login exitoso:', {
                            username: credentials.username,
                            expiresIn: response.expires_in,
                            tokenType: response.token_type
                        });
                    }
                })
            );
    }

    /**
     * Cierra sesión
     */
    logout(): void {
        // Limpiar tokens y datos de usuario
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);

        // Actualizar estado
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);

        // Redirigir a login
        this.router.navigate(['/login']);

        if (environment.logging.enableConsole) {
            console.log('👋 Sesión cerrada');
        }
    }

    /**
     * Obtiene el token de acceso
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Obtiene el refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Guarda el token de acceso
     */
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Guarda el refresh token
     */
    private setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    /**
     * Guarda información del usuario
     */
    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Obtiene el usuario almacenado
     */
    private getStoredUser(): User | null {
        const userData = localStorage.getItem(this.USER_KEY);
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Verifica si hay un token almacenado
     */
    private hasToken(): boolean {
        return !!this.getToken();
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        return this.hasToken();
    }

    /**
     * Verifica si el token ha expirado (requiere decodificar JWT)
     * TODO: Implementar decodificación de JWT para verificar expiración
     */
    isTokenExpired(): boolean {
        // Por ahora retorna false, implementar cuando sea necesario
        return false;
    }
}
