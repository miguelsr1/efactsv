import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

interface Plan {
  size: string;
  price: number;
  featureA: string;
  featureB: string;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './plans.html',
  styleUrls: ['./plans.css'],
})
export class Plans {
  // Arreglo de planes con la estructura solicitada
  // Usado directamente por la plantilla (plans.html)
  plans: Plan[] = [
    { size: 'Paquete Básico A', price: 5.99, featureA: 'Generación de hasta 150 DTES', featureB: '1 usuario de acceso' },
    { size: 'Paquete Básico B', price: 50, featureA: 'Generación de hasta 400 DTES', featureB: '2 usuarios de acceso' },
    { size: 'Paquete Básico C', price: 100, featureA: 'Generación de hasta 800 DTES', featureB: '2 usuarios de acceso' },
  ];
}
