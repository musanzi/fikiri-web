import { afterNextRender, Component, computed, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html'
})
export class Header {
  private readonly router = inject(Router);

  readonly links = [
    { name: 'Accueil', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'À propos', path: '/', fragment: 'about' },
    { name: 'Notre mission', path: '/', fragment: 'mission' },
    { name: 'Les champions', path: '/', fragment: 'awards' },
    { name: 'SDGs', path: '/', fragment: 'sdgs' }
  ];
  readonly activeLinkMatchOptions: IsActiveMatchOptions = {
    paths: 'exact',
    fragment: 'exact',
    queryParams: 'exact',
    matrixParams: 'exact'
  };

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly landingPage = signal(this.isLandingRoute(this.router.url));
  readonly overlaysHero = computed(() => this.landingPage() && !this.scrolled());
  readonly solidHeader = computed(() => !this.landingPage() || this.scrolled());

  constructor() {
    afterNextRender(() => this.updateScrolledState());

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => this.landingPage.set(this.isLandingRoute(event.urlAfterRedirects)));
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrolledState();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  navLinkClasses(active = false): string {
    if (this.overlaysHero()) {
      return active
        ? 'border-white text-white'
        : 'border-transparent text-white/80 hover:border-white/40 hover:text-white';
    }

    return active
      ? 'border-primary-500 text-gray-950'
      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-950';
  }

  mobileNavLinkClasses(active = false): string {
    return active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950';
  }

  private updateScrolledState(): void {
    this.scrolled.set(window.scrollY > 0);
  }

  private isLandingRoute(url: string): boolean {
    return url.split(/[?#]/, 1)[0] === '/';
  }
}
