import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, type IsActiveMatchOptions } from '@angular/router';
import { filter, map } from 'rxjs';

interface NavigationLink {
  readonly name: string;
  readonly path: string;
  readonly icon: string;
  readonly fragment?: string;
}

const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { name: 'Accueil', path: '/', icon: 'house' },
  { name: 'Solutions', path: '/solutions', icon: 'lightbulb' },
  { name: 'À propos', path: '/', fragment: 'about', icon: 'info' },
  { name: 'Notre mission', path: '/', fragment: 'mission', icon: 'target' },
  { name: 'Les champions', path: '/', fragment: 'awards', icon: 'award' },
  { name: 'SDGs', path: '/', fragment: 'sdgs', icon: 'earth' }
];

const ACTIVE_LINK_MATCH_OPTIONS = {
  paths: 'exact',
  fragment: 'exact',
  queryParams: 'exact',
  matrixParams: 'exact'
} as const satisfies IsActiveMatchOptions;

const isLandingRoute = (url: string): boolean => url.split(/[?#]/, 1)[0] === '/';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIcon, RouterLink, RouterLinkActive],
  host: {
    '(window:scroll)': 'updateScrolledState()'
  },
  templateUrl: './header.html'
})
export class Header {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );
  private readonly isScrolled = signal(false);
  private readonly isMenuOpen = signal(false);

  protected readonly links = NAVIGATION_LINKS;
  protected readonly activeLinkMatchOptions = ACTIVE_LINK_MATCH_OPTIONS;
  protected readonly menuOpen = this.isMenuOpen.asReadonly();
  protected readonly overlaysHero = computed(() => isLandingRoute(this.currentUrl()) && !this.isScrolled());
  protected readonly solidHeader = computed(() => !this.overlaysHero());

  constructor() {
    afterNextRender(() => this.updateScrolledState());
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected navLinkClasses(active: boolean): string {
    if (this.overlaysHero()) {
      return active
        ? 'border-white text-white'
        : 'border-transparent text-white/80 hover:border-white/40 hover:text-white';
    }

    return active
      ? 'border-primary-500 text-gray-950'
      : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-950';
  }

  protected mobileNavLinkClasses(active: boolean): string {
    return active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950';
  }

  protected updateScrolledState(): void {
    this.isScrolled.set(window.scrollY > 0);
  }
}
