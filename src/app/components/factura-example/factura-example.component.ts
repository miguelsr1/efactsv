import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaService } from '../../services/factura.service';
import { Factura, EstadoFactura, FacturaSearchParams } from '../../models/factura.model';

/**
 * Componente de ejemplo para demostrar el uso de los servicios REST
 * Este componente muestra cómo:
 * - Obtener lista de facturas
 * - Crear una nueva factura
 * - Actualizar una factura
 * - Eliminar una factura
 * - Manejar errores
 */
@Component({
  selector: 'app-factura-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="factura-example">
      <h2>Ejemplo de Uso de Servicios REST</h2>
      
      <div class="actions">
        <button (click)="loadFacturas()">Cargar Facturas</button>
        <button (click)="createNewFactura()">Crear Factura</button>
      </div>

      <div *ngIf="loading" class="loading">
        Cargando...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      
    </div>
  `,
  styles: [`
    .factura-example {
      padding: 20px;
    }
    
    .actions {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }
    
    button {
      padding: 10px 20px;
      background: #60a5fa;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    
    button:hover {
      background: #3b82f6;
    }
    
    .loading {
      padding: 20px;
      background: #f0f9ff;
      border-radius: 8px;
      color: #0369a1;
    }
    
    .error {
      padding: 20px;
      background: #fef2f2;
      border-radius: 8px;
      color: #dc2626;
    }
    
    .facturas-list {
      margin-top: 20px;
    }
    
    .facturas-list ul {
      list-style: none;
      padding: 0;
    }
    
    .facturas-list li {
      padding: 10px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    
    .estado-APROBADA {
      color: #10b981;
      font-weight: 600;
    }
    
    .estado-RECHAZADA {
      color: #ef4444;
      font-weight: 600;
    }
    
    .estado-PROCESANDO {
      color: #f59e0b;
      font-weight: 600;
    }
  `]
})
export class FacturaExampleComponent implements OnInit {
  facturas: Factura[] = [];
  loading = false;
  error: string | null = null;

  constructor(private facturaService: FacturaService) { }

  ngOnInit(): void {
    // Cargar facturas al iniciar el componente
    // this.loadFacturas();
  }

  /**
   * Ejemplo: Cargar lista de facturas con filtros
   */
  loadFacturas(): void {
    this.loading = true;
    this.error = null;

    const params: FacturaSearchParams = {
      page: 1,
      limit: 10,
      estado: EstadoFactura.APROBADA
    };

    this.facturaService.getFacturas(params).subscribe({
      next: (response) => {
        this.facturas = response.data;
        this.loading = false;
        console.log('✅ Facturas cargadas:', response);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error al cargar facturas:', error);
      }
    });
  }

  /**
   * Ejemplo: Crear una nueva factura
   */
  createNewFactura(): void {
    this.loading = true;
    this.error = null;

    const nuevaFactura: Partial<Factura> = {
      numeroControl: 'DTE-001-00000001',
      codigoGeneracion: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
      fechaEmision: new Date().toISOString(),
      cliente: {
        nit: '0614-123456-001-1',
        nombre: 'Empresa Demo SV',
        email: 'contacto@empresademo.sv',
        direccion: {
          departamento: 'San Salvador',
          municipio: 'San Salvador',
          complemento: 'Col. Escalón, Calle Principal #123'
        }
      },
      items: [
        {
          cantidad: 2,
          descripcion: 'Servicio de Facturación Electrónica',
          precioUnitario: 50.00,
          ventaGravada: 100.00,
          ventaExenta: 0
        }
      ],
      subtotal: 100.00,
      iva: 13.00,
      total: 113.00,
      estado: EstadoFactura.BORRADOR
    };

    this.facturaService.createFactura(nuevaFactura).subscribe({
      next: (factura) => {
        console.log('✅ Factura creada:', factura);
        this.loading = false;
        // Recargar lista
        this.loadFacturas();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error al crear factura:', error);
      }
    });
  }

  /**
   * Ejemplo: Actualizar una factura
   */
  updateFactura(id: string): void {
    const updates: Partial<Factura> = {
      estado: EstadoFactura.PROCESANDO
    };

    this.facturaService.updateFactura(id, updates).subscribe({
      next: (factura) => {
        console.log('✅ Factura actualizada:', factura);
      },
      error: (error) => {
        console.error('❌ Error al actualizar:', error);
      }
    });
  }

  /**
   * Ejemplo: Eliminar una factura
   */
  deleteFactura(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
      this.facturaService.deleteFactura(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Factura eliminada');
            this.loadFacturas();
          }
        },
        error: (error) => {
          console.error('❌ Error al eliminar:', error);
        }
      });
    }
  }

  /**
   * Ejemplo: Enviar factura a Hacienda
   */
  enviarAHacienda(id: string): void {
    this.facturaService.enviarAHacienda(id).subscribe({
      next: (factura) => {
        console.log('✅ Factura enviada a Hacienda:', factura);
      },
      error: (error) => {
        console.error('❌ Error al enviar:', error);
      }
    });
  }
}
