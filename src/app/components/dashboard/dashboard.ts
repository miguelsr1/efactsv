import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard">
      <h3>Dashboard</h3>
      <p>Contenido del dashboard aquí...</p>
    </div>
  `,
    styles: [`
    .dashboard {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }

    p {
      color: #6b7280;
      margin: 0;
    }
  `]
})
export class Dashboard { }
