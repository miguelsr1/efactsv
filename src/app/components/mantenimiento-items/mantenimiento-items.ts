import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
    selector: 'app-mantenimiento-items',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
        ToastModule,
        TooltipModule,
        TagModule
    ],
    providers: [MessageService],
    templateUrl: './mantenimiento-items.html',
    styleUrls: ['./mantenimiento-items.css']
})
export class MantenimientoItemsComponent implements OnInit {
    items: Item[] = [];
    loading: boolean = false;
    displayDialog: boolean = false;
    isEditMode: boolean = false;
    saving: boolean = false;

    // Form model
    currentItem: Item = this.getEmptyItem();

    constructor(
        private itemService: ItemService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadItems();
    }

    /**
     * Carga todos los items desde el servidor
     */
    loadItems(): void {
        this.loading = true;
        this.itemService.getAllItems().subscribe({
            next: (data) => {
                this.items = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los items',
                    life: 3000
                });
                console.error('Error al cargar items:', err);
            }
        });
    }

    /**
     * Muestra el dialog para crear un nuevo item
     */
    showCreateDialog(): void {
        this.isEditMode = false;
        this.currentItem = this.getEmptyItem();
        this.displayDialog = true;
    }

    /**
     * Muestra el dialog para editar un item existente
     */
    showEditDialog(item: Item): void {
        this.isEditMode = true;
        this.currentItem = { ...item }; // Clonar el objeto
        this.displayDialog = true;
    }

    /**
     * Guarda el item (crear o actualizar)
     */
    saveItem(): void {
        if (!this.validateForm()) {
            return;
        }

        this.saving = true;

        if (this.isEditMode) {
            // Actualizar item existente
            this.itemService.updateItem(this.currentItem.idProducto, this.currentItem).subscribe({
                next: () => {
                    this.saving = false;
                    this.displayDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Item actualizado correctamente',
                        life: 3000
                    });
                    this.loadItems();
                },
                error: (err) => {
                    this.saving = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar el item',
                        life: 3000
                    });
                    console.error('Error al actualizar item:', err);
                }
            });
        } else {
            // Crear nuevo item
            this.itemService.createItem(this.currentItem).subscribe({
                next: () => {
                    this.saving = false;
                    this.displayDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Item creado correctamente',
                        life: 3000
                    });
                    this.loadItems();
                },
                error: (err) => {
                    this.saving = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear el item',
                        life: 3000
                    });
                    console.error('Error al crear item:', err);
                }
            });
        }
    }

    /**
     * Valida el formulario
     */
    validateForm(): boolean {
        if (!this.currentItem.nombre || this.currentItem.nombre.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El nombre es requerido',
                life: 3000
            });
            return false;
        }

        if (!this.currentItem.codigoItem || this.currentItem.codigoItem.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de item es requerido',
                life: 3000
            });
            return false;
        }

        if (this.currentItem.codigoItem.length > 2) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de item debe tener máximo 2 caracteres',
                life: 3000
            });
            return false;
        }

        if (!this.currentItem.codigoProducto || this.currentItem.codigoProducto.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de producto es requerido',
                life: 3000
            });
            return false;
        }

        if (!this.currentItem.codigoUnidad || this.currentItem.codigoUnidad.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de unidad es requerido',
                life: 3000
            });
            return false;
        }

        if (this.currentItem.precioUnitario === null || this.currentItem.precioUnitario === undefined || this.currentItem.precioUnitario < 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El precio unitario debe ser mayor o igual a 0',
                life: 3000
            });
            return false;
        }

        return true;
    }

    /**
     * Cancela la edición y cierra el dialog
     */
    cancelEdit(): void {
        this.displayDialog = false;
        this.currentItem = this.getEmptyItem();
    }

    /**
     * Retorna un objeto Item vacío
     */
    getEmptyItem(): Item {
        return {
            idProducto: 0,
            nombre: '',
            codigoUnidad: '',
            activo: true,
            exento: false,
            codigoItem: '',
            codigoProducto: '',
            precioUnitario: 0
        };
    }
}
