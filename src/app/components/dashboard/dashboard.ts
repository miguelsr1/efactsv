import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardItem, DashboardStats } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    TagModule,
    ChartModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // Datos
  facturas: DashboardItem[] = [];
  facturasFiltered: DashboardItem[] = [];
  stats: DashboardStats | null = null;

  // Estados de carga
  loading = false;
  error: string | null = null;

  // Filtros
  searchTerm = '';
  selectedEstado: string | null = null;
  estadoOptions = [
    { label: 'Todos', value: null },
    { label: 'Enviado', value: 'ENVIADO' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Rechazado', value: 'RECHAZADO' }
  ];

  // Datos para gráficos
  pieChartData: any;
  lineChartData: any;
  donutChartData: any;
  chartOptions: any;

  // Datos para secciones de resumen
  invoicedAmounts: any[] = [];
  balanceDte: any = null;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupChartOptions();
  }

  /**
   * Carga los datos del dashboard
   */
  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltered = data;
        this.stats = this.dashboardService.calculateStats(data);
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar datos del dashboard';
        this.loading = false;
        console.error('Error:', error);
      }
    });

    // Cargar montos facturados
    this.dashboardService.getInvoicedAmounts().subscribe({
      next: (data) => {
        this.invoicedAmounts = data;
      },
      error: (error) => {
        console.error('Error al cargar montos facturados:', error);
      }
    });

    // Cargar balance de DTEs
    this.dashboardService.getBalanceDte().subscribe({
      next: (data) => {
        this.balanceDte = data;
        this.prepareDonutChart();
      },
      error: (error) => {
        console.error('Error al cargar balance de DTEs:', error);
      }
    });
  }

  /**
   * Prepara los datos para los gráficos
   */
  prepareChartData(): void {
    if (!this.stats) return;

    // Gráfico de pastel - Distribución por tipo de DTE
    const tipoLabels = Object.keys(this.stats.facturasPorTipo);
    const tipoData = Object.values(this.stats.facturasPorTipo);

    this.pieChartData = {
      labels: tipoLabels,
      datasets: [{
        data: tipoData,
        backgroundColor: [
          '#3b82f6', // Azul
          '#10b981', // Verde
          '#f59e0b', // Amarillo
          '#ef4444', // Rojo
          '#8b5cf6', // Púrpura
          '#06b6d4'  // Cyan
        ]
      }]
    };

    // Gráfico de línea - Facturas por mes
    const mesesLabels = this.stats.facturasPorMes.map(item => {
      const [year, month] = item.mes.split('-');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    const mesesData = this.stats.facturasPorMes.map(item => item.cantidad);

    this.lineChartData = {
      labels: mesesLabels,
      datasets: [{
        label: 'Facturas',
        data: mesesData,
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4
      }]
    };
  }

  /**
   * Configura las opciones de los gráficos
   */
  setupChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    };
  }

  /**
   * Filtra las facturas según búsqueda y estado
   */
  filterFacturas(): void {
    let filtered = this.facturas;

    // Filtrar por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f =>
        f.nombreCompleto.toLowerCase().includes(term) ||
        f.numDocumento.toLowerCase().includes(term) ||
        f.correo.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (this.selectedEstado) {
      filtered = filtered.filter(f => f.descripcion === this.selectedEstado);
    }

    this.facturasFiltered = filtered;
  }

  /**
   * Limpia los filtros
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEstado = null;
    this.facturasFiltered = this.facturas;
  }

  /**
   * Prepara el gráfico de dona para balance del plan
   */
  prepareDonutChart(): void {
    if (!this.balanceDte) return;

    this.donutChartData = {
      labels: ['GENERADOS ' + this.balanceDte.subTotal, 'SALDO ' + this.balanceDte.pendiente],
      datasets: [{
        data: [this.balanceDte.subTotal, this.balanceDte.pendiente],
        backgroundColor: ['#ec4899', '#3b82f6'],
        hoverBackgroundColor: ['#db2777', '#2563eb']
      }]
    };
  }

  /**
   * Formatea un número como moneda
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  /**
   * Formatea una fecha
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
