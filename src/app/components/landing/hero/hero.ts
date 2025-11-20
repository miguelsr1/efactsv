import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ButtonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

}
