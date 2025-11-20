import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ServiceComposite, ServiceLeaf} from './composite';
import {Feature} from './components/landing/feature/feature';
import { Plans } from './components/landing/plans/plans';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Feature, Plans, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('efact');

  // Exponer un resumen del composite como texto para la plantilla
  compositeSummaryText = '';

  constructor() {
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
      if (node.getChildren && node.getChildren().length) {
        node.getChildren().forEach((c: any) => walk(c, depth + 1));
      }
    };

    walk(oferta);

    this.compositeSummaryText = lines.join('\n');
  }
}
