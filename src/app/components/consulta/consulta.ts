import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DteService } from '../../services/dte.service';
import { Dte, DteSearchParams } from '../../models/dte.model';

@Component({
    selector: 'app-consulta',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        TooltipModule,
        DatePickerModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './consulta.html',
    styleUrls: ['./consulta.css']
})
export class ConsultaComponent implements OnInit {
    dtes: Dte[] = [];
    loading: boolean = false; // Cambiado a false para que inicie sin loading
    error: string | null = null;

    // Filtros
    filtroCorreo: string = '';
    filtroFecha: Date | null = null;
    filtroNombre: string = '';
    filtroNumDocumento: string = '';

    constructor(
        private dteService: DteService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        // No cargar datos automáticamente, la tabla inicia vacía
    }

    loadDtes(): void {
        this.loading = true;
        this.error = null;

        const params: DteSearchParams = {};
        if (this.filtroCorreo) params.correo = this.filtroCorreo;
        if (this.filtroFecha) {
            // Formatear fecha a dd/MM/yyyy
            const day = String(this.filtroFecha.getDate()).padStart(2, '0');
            const month = String(this.filtroFecha.getMonth() + 1).padStart(2, '0');
            const year = this.filtroFecha.getFullYear();
            params.fecha = `${day}/${month}/${year}`;
        }
        if (this.filtroNombre) params.nombre = this.filtroNombre;
        if (this.filtroNumDocumento) params.numDocumento = this.filtroNumDocumento;

        this.dteService.getAllDtes(params).subscribe({
            next: (data) => {
                this.dtes = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;

                console.log("codigo de error:" + err.status);

                // Si es un error 404, limpiar la tabla y mostrar toast
                if (err.status === 404 ) {
                    this.dtes = [];
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin resultados',
                        detail: 'No se han encontrado registros',
                        life: 3000
                    });
                } else {
                    this.error = 'Error al cargar los DTEs';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al cargar los DTEs',
                        life: 3000
                    });
                }

                console.error('Error en consulta:', err);
            }
        });
    }

    buscar(): void {
        this.loadDtes();
    }

    limpiar(): void {
        this.filtroCorreo = '';
        this.filtroFecha = null;
        this.filtroNombre = '';
        this.filtroNumDocumento = '';
        this.dtes = []; // Limpiar la tabla también
        this.error = null;
    }

    /**
     * Obtiene la clase CSS para el estado del DTE
     */
    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'ENVIADO':
                return 'dte-recibido'; // Asumiendo que ENVIADO = RECIBIDO por Hacienda
            case 'PENDIENTE':
                return 'dte-no-recibido';
            case 'RECHAZADO':
                return 'dte-rechazado';
            case 'RECIBIDO CON OBS.':
                return 'dte-recibido-observado';
            case 'ANULADO':
                return 'dte-anulado';
            default:
                return '';
        }
    }

    /**
     * Copia texto al portapapeles
     */
    copyText(text: string): void {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            // Podríamos mostrar un toast aquí si tuviéramos MessageService
            console.log('Código copiado:', text);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }
}
