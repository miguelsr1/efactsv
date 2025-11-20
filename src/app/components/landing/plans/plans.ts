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
  imports: [CommonModule, ButtonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  // Arreglo de planes con la estructura solicitada
  // Usado directamente por la plantilla (plans.html)
  plans: Plan[] = [
    { size: 'Básico', price: 5.99, featureA: 'Generación de hasta 150 DTES', featureB: '1 usuario de acceso' },
    { size: 'Premium', price: 12.99, featureA: 'Generación de hasta 400 DTES', featureB: '2 usuarios de acceso' },
    { size: 'Enterprise', price: 16.99, featureA: 'Generación de hasta 800 DTES', featureB: '2 usuarios de acceso' },
  ];
}
