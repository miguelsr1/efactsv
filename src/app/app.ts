import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceComposite, ServiceLeaf } from './composite';
import { Feature } from './components/landing/feature/feature';
import { Plans } from './components/landing/plans/plans';
import { Hero } from './components/landing/hero/hero';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Feature, Plans, Hero],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Indica si la ruta actual es la página de login
  isLoginRoute = false;

  // Exponer un resumen del composite como texto para la plantilla
  compositeSummaryText = '';

  constructor(private router: Router) {
    // Crear una composición de ejemplo
    const plataforma = new ServiceComposite('Plataforma Web');
    plataforma.add(new ServiceLeaf('Generación de DTES', 25));
    plataforma.add(new ServiceLeaf('Almacenamiento seguro', 10));

    const soporte = new ServiceComposite('Soporte Técnico');
    soporte.add(new ServiceLeaf('Soporte urgente (WhatsApp/email)', 15));

    const compras = new ServiceComposite('Módulo de Compras');
    compras.add(new ServiceLeaf('Reporte contable (pendiente)', 5));

    const oferta = new ServiceComposite('Oferta Mensual');
    oferta.add(plataforma);
    oferta.add(soporte);
    oferta.add(compras);

    // Generar resumen legible
    const lines: string[] = [];
    const walk = (node: any, depth = 0) => {
      const indent = '  '.repeat(depth);
      lines.push(`${indent}- ${node.getName()} : $${node.getCost().toFixed(2)}`);
      for (const c of (node.getChildren?.() ?? [])) {
        walk(c, depth + 1);
      }
    };

    walk(oferta);

    this.compositeSummaryText = lines.join('\n');

    // Inicializar estado de ruta y suscribirse a cambios de navegación
    this.isLoginRoute = this.router.url === '/login';
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.isLoginRoute = ev.urlAfterRedirects === '/login';
      }
    });
  }

  goToLogin() {
    // Navegar a /login reemplazando la entrada de historial para redirección "completa"
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
