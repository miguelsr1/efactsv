/**
 * Credenciales de login
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    'not-before-policy': number;
    session_state: string;
    scope: string;
}

/**
 * Usuario autenticado (información adicional)
 */
export interface User {
    username: string;
    email?: string;
    roles?: string[];
    fullName?: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}
