import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports: [MatIconModule, RouterLink, RouterOutlet],
  template: `
    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <main class="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div class="w-full max-w-md">
          <a routerLink="/" class="mb-6 flex items-center gap-2 font-medium text-primary-600 hover:underline">
            <mat-icon svgIcon="arrow-left" class="size-4" />
            Revenir à l'accueil
          </a>
          <router-outlet />
        </div>
      </main>

      <aside
        class="relative hidden min-h-screen overflow-hidden bg-[url('/images/auth.webp')] bg-cover bg-center lg:block">
        <div class="absolute inset-0 bg-primary-950/40"></div>
      </aside>
    </div>
  `
})
export class AuthLayout {}
