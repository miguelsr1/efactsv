import { Component } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceComposite, ServiceLeaf } from '../../composite';
import { Feature } from '../landing/feature/feature';
import { Plans } from '../landing/plans/plans';
import { Hero } from '../landing/hero/hero';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, Feature, Plans, Hero],
    templateUrl: './landing.html',
    styleUrls: ['./landing.css']
})
export class Landing {
    // Exponer un resumen del composite como texto para la plantilla
    compositeSummaryText = '';

    constructor(
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {
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
    }

    /**
     * Navega suavemente a una sección específica de la página
     */
    scrollToSection(sectionId: string): void {
        this.viewportScroller.scrollToAnchor(sectionId);
    }

    /**
     * Navega a la página de login
     */
    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
