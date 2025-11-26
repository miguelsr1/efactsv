// Configuración de entorno para PRODUCCIÓN
import { Environment } from './environment';

export const environment: Environment = {
    production: true,
    appName: 'eFacturaMe SV',
    version: '1.0.0',

    // Configuración de API
    api: {
        baseUrl: 'https://api.efacturame.sv/api/v1',
        timeout: 10000,
        retryAttempts: 2
    },

    // Feature Flags
    features: {
        enableLogin: true,
        enableFacturacion: true,
        enableReportes: true,
        enableDebugMode: false
    },

    // Servicios Externos
    services: {
        haciendaUrl: 'https://api.hacienda.gob.sv/api',
        storageUrl: 'https://storage.efacturame.sv'
    },

    // Configuración de Logging
    logging: {
        level: 'error' as 'debug' | 'error' | 'warn' | 'info',
        enableConsole: false,
        enableRemote: true
    }
};
