import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})
export class Home implements OnInit {
    currentUser: User | null = null;
    sidebarOpen = true;

    // Menú de navegación
    menuItems = {
        favoritos: [
            { icon: 'pi-home', label: 'Dashboard', route: '/home/dashboard' }
        ],
        operaciones: [
            { icon: 'pi-file', label: 'Factura', route: '/home/factura' },
            { icon: 'pi-list', label: "DTE's", route: '/home/dtes' },
            { icon: 'pi-shopping-cart', label: 'Ingreso de compras', route: '/home/compras' }
        ],
        mantenimientos: [
            { icon: 'pi-box', label: 'Items', route: '/home/items' },
            { icon: 'pi-id-card', label: 'Mis Datos', route: '/home/mis-datos' },
            { icon: 'pi-users', label: 'Clientes', route: '/home/clientes' }
        ]
    };

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Obtener usuario actual
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    /**
     * Toggle del sidebar
     */
    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen;
    }

    /**
     * Cerrar sesión
     */
    logout(): void {
        this.authService.logout();
    }

    /**
     * Ir a configuración
     */
    goToSettings(): void {
        this.router.navigate(['/home/configuracion']);
    }
}
