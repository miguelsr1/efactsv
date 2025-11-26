import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, CheckboxModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  // Credenciales
  username = '';
  password = '';

  // Estados
  loading = false;
  error: string | null = null;

  // Checkbox "Recordarme"
  checked1 = signal<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Maneja el evento de login
   */
  onLogin(): void {
    // Validar campos
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.error = null;

    // Llamar al servicio de autenticación
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso');
        this.loading = false;

        // Redirigir al home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);

        // Mostrar mensaje de error apropiado
        if (error.status === 401) {
          this.error = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          this.error = 'No se pudo conectar al servidor';
        } else {
          this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        }

        this.loading = false;
      }
    });
  }

  /**
   * Navega al home sin login
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }
}
