import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardItem, DashboardStats, InvoicedAmount, BalanceDte } from '../models/dashboard.model';

/**
 * Servicio para obtener datos del dashboard de facturación
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly endpoint = '/secured/dashboard';

    constructor(private apiService: ApiService) { }

    /**
     * Obtiene los datos del dashboard
     */
    getDashboardData(): Observable<DashboardItem[]> {
        return this.apiService.get<DashboardItem[]>(this.endpoint);
    }

    /**
     * Obtiene los montos facturados por período
     */
    getInvoicedAmounts(): Observable<InvoicedAmount[]> {
        return this.apiService.get<InvoicedAmount[]>(`${this.endpoint}/invoiced-amounts`);
    }

    /**
     * Obtiene el balance de DTEs del plan
     */
    getBalanceDte(): Observable<BalanceDte> {
        return this.apiService.get<BalanceDte>(`${this.endpoint}/balance-dte`);
    }

    /**
     * Calcula estadísticas a partir de los datos del dashboard
     */
    calculateStats(data: DashboardItem[]): DashboardStats {
        const stats: DashboardStats = {
            totalFacturas: data.length,
            montoTotal: 0,
            facturasPorEstado: {},
            facturasPorTipo: {},
            facturasPorMes: []
        };

        // Calcular monto total y agrupar por estado y tipo
        data.forEach(item => {
            stats.montoTotal += item.monto;

            // Contar por estado
            const estado = item.descripcion;
            stats.facturasPorEstado[estado] = (stats.facturasPorEstado[estado] || 0) + 1;

            // Contar por tipo de DTE
            const tipo = item.abreviatura;
            stats.facturasPorTipo[tipo] = (stats.facturasPorTipo[tipo] || 0) + 1;
        });

        // Agrupar por mes
        const facturasPorMes = new Map<string, number>();
        data.forEach(item => {
            const fecha = new Date(item.fechaCreacion);
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            facturasPorMes.set(mesKey, (facturasPorMes.get(mesKey) || 0) + 1);
        });

        // Convertir a array y ordenar
        stats.facturasPorMes = Array.from(facturasPorMes.entries())
            .map(([mes, cantidad]) => ({ mes, cantidad }))
            .sort((a, b) => a.mes.localeCompare(b.mes));

        return stats;
    }

    /**
   * Obtiene el color según el estado
   */
    getEstadoColor(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
        const colores: { [key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' } = {
            'ENVIADO': 'success',
            'PENDIENTE': 'warn',
            'RECHAZADO': 'danger',
            'PROCESANDO': 'info'
        };
        return colores[estado.toUpperCase()] || 'secondary';
    }

    /**
     * Obtiene el icono según el estado
     */
    getEstadoIcon(estado: string): string {
        const iconos: { [key: string]: string } = {
            'ENVIADO': 'pi-check-circle',
            'PENDIENTE': 'pi-clock',
            'RECHAZADO': 'pi-times-circle',
            'PROCESANDO': 'pi-spin pi-spinner'
        };
        return iconos[estado.toUpperCase()] || 'pi-info-circle';
    }
}
