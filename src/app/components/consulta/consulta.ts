import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { DteService } from '../../services/dte.service';
import { InvalidateService } from '../../services/invalidate.service';
import { Dte, DteSearchParams, InvalidateInfo } from '../../models/dte.model';

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
        ToastModule,
        DialogModule
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

    // PDF Dialog
    displayPdfDialog: boolean = false;
    pdfUrl: SafeResourceUrl | null = null;
    unsafePdfUrl: string | null = null; // URL sin sanitizar para descarga y limpieza
    loadingPdf: boolean = false;
    currentDte: Dte | null = null; // DTE actual para obtener el código de generación

    // Invalidate Dialog
    displayInvalidateDialog: boolean = false;
    invalidateInfo: InvalidateInfo | null = null;
    loadingInvalidateInfo: boolean = false;
    invalidating: boolean = false;
    selectedDteForInvalidate: Dte | null = null;

    constructor(
        private dteService: DteService,
        private invalidateService: InvalidateService,
        private messageService: MessageService,
        private sanitizer: DomSanitizer
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
                if (err.status === 404) {
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

    /**
     * Imprime el DTE - Obtiene el PDF del servidor y lo muestra en un dialog
     */
    printDte(dte: Dte): void {
        this.loadingPdf = true;
        this.displayPdfDialog = true;
        this.currentDte = dte; // Guardar el DTE actual

        this.dteService.getReport(dte.idFactura).subscribe({
            next: (response) => {
                // Convertir base64 a blob
                const byteCharacters = atob(response.pdf);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });

                // Crear URL del blob y sanitizarla
                const unsafeUrl = URL.createObjectURL(blob);
                this.unsafePdfUrl = unsafeUrl;
                this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
                this.loadingPdf = false;

                this.messageService.add({
                    severity: 'success',
                    summary: 'PDF Cargado',
                    detail: 'El reporte se ha cargado correctamente',
                    life: 3000
                });
            },
            error: (err) => {
                this.loadingPdf = false;
                this.displayPdfDialog = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar el reporte PDF',
                    life: 3000
                });
                console.error('Error al obtener PDF:', err);
            }
        });
    }

    /**
     * Descarga el PDF actual
     */
    downloadPdf(): void {
        if (!this.unsafePdfUrl) return;

        const fileName = this.currentDte?.codigoGeneracion || `reporte_dte_${Date.now()}`;
        const link = document.createElement('a');
        link.href = this.unsafePdfUrl;
        link.download = `${fileName}.pdf`;
        link.click();

        this.messageService.add({
            severity: 'success',
            summary: 'Descarga Iniciada',
            detail: 'El PDF se está descargando',
            life: 3000
        });
    }

    /**
     * Cierra el dialog y limpia la URL del PDF
     */
    closePdfDialog(): void {
        this.displayPdfDialog = false;
        if (this.unsafePdfUrl) {
            URL.revokeObjectURL(this.unsafePdfUrl);
            this.unsafePdfUrl = null;
            this.pdfUrl = null;
        }
        this.currentDte = null; // Limpiar el DTE actual
    }

    /**
     * Muestra el dialog de anulación y obtiene la información del DTE
     */
    showInvalidateDialog(dte: Dte): void {
        this.selectedDteForInvalidate = dte;
        this.displayInvalidateDialog = true;
        this.loadingInvalidateInfo = true;
        this.invalidateInfo = null;

        this.invalidateService.getInvalidateInfo(dte.idFactura).subscribe({
            next: (info) => {
                this.invalidateInfo = info;
                this.loadingInvalidateInfo = false;
            },
            error: (err) => {
                this.loadingInvalidateInfo = false;
                this.displayInvalidateDialog = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al obtener información del DTE',
                    life: 3000
                });
                console.error('Error al obtener info de anulación:', err);
            }
        });
    }

    /**
     * Confirma la anulación del DTE
     */
    confirmInvalidate(): void {
        if (!this.selectedDteForInvalidate) return;

        this.invalidating = true;

        this.invalidateService.invalidateDte({ idFactura: this.selectedDteForInvalidate.idFactura }).subscribe({
            next: () => {
                this.invalidating = false;
                this.displayInvalidateDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'DTE Anulado',
                    detail: 'El DTE ha sido anulado correctamente',
                    life: 3000
                });
                // Recargar la lista de DTEs
                this.loadDtes();
                this.selectedDteForInvalidate = null;
                this.invalidateInfo = null;
            },
            error: (err) => {
                this.invalidating = false;
                let errorMessage = 'Error al anular el DTE';

                // Manejo de códigos de error específicos
                switch (err.status) {
                    case 401:
                        errorMessage = 'Token expirado. Por favor, inicie sesión nuevamente';
                        break;
                    case 504:
                        errorMessage = 'Tiempo de espera agotado. Intente nuevamente';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor';
                        break;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 3000
                });
                console.error('Error al anular DTE:', err);
            }
        });
    }

    /**
     * Cancela el dialog de anulación
     */
    cancelInvalidate(): void {
        this.displayInvalidateDialog = false;
        this.selectedDteForInvalidate = null;
        this.invalidateInfo = null;
    }
}
