import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DteService } from '../../services/dte.service';
import { Dte } from '../../models/dte.model';

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
        TooltipModule
    ],
    templateUrl: './consulta.html',
    styleUrls: ['./consulta.css']
})
export class ConsultaComponent implements OnInit {
    dtes: Dte[] = [];
    loading: boolean = true;
    error: string | null = null;

    constructor(private dteService: DteService) { }

    ngOnInit(): void {
        this.loadDtes();
    }

    loadDtes(): void {
        this.loading = true;
        this.dteService.getAllDtes().subscribe({
            next: (data) => {
                this.dtes = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar los DTEs';
                this.loading = false;
                console.error(err);
            }
        });
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
