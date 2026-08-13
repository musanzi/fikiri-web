import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './ui/header/header';
import { Footer } from './ui/footer/footer';

@Component({
  selector: 'web-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="min-h-screen overflow-x-hidden">
      <app-header />
      <main id="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class WebLayout {}
