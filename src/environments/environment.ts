// Configuración de entorno para DESARROLLO
export const environment = {
    production: false,
    appName: 'eFacturaMe SV',
    version: '1.0.0',

    // Configuración de API
    api: {
        baseUrl: 'http://localhost:8082/api',
        timeout: 30000,
        retryAttempts: 3
    },

    // Feature Flags
    features: {
        enableLogin: true,
        enableFacturacion: true,
        enableReportes: false,
        enableDebugMode: true
    },

    // Servicios Externos
    services: {
        haciendaUrl: 'https://test.hacienda.gob.sv/api',
        storageUrl: 'http://localhost:9000'
    },

    // Configuración de Logging
    logging: {
        level: 'debug' as 'debug' | 'error' | 'warn' | 'info',
        enableConsole: true,
        enableRemote: false
    }
};

// Tipo para el objeto environment
export type Environment = typeof environment;
