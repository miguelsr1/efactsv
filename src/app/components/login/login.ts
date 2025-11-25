import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, CheckboxModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  constructor(private router: Router) { }

  checked1 = signal<boolean>(true);

  goToHome() {
    this.router.navigate(['/']);
  }

  
}
