import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './ui/header/header';
import { Footer } from './ui/footer/footer';

@Component({
  selector: 'web-page-loader',
  template: `
    <div class="page-loader" role="status" aria-live="polite" aria-label="Chargement de la page">
      <div class="page-loader__glow" aria-hidden="true"></div>

      <div class="page-loader__content">
        <div class="page-loader__mark" aria-hidden="true">
          <span class="page-loader__orbit page-loader__orbit--outer"></span>
          <span class="page-loader__orbit page-loader__orbit--inner"></span>
          <img src="/images/favicon.png" alt="" class="page-loader__logo" />
        </div>

        <p class="page-loader__brand">fikiri<span>.</span></p>
        <p class="page-loader__message">Chargement de votre expérience</p>

        <div class="page-loader__dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-loader {
      position: relative;
      display: grid;
      min-height: 100dvh;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(
          circle at 50% 42%,
          color-mix(in srgb, var(--color-primary-500) 12%, transparent),
          transparent 32rem
        ),
        linear-gradient(145deg, #f8fafc 0%, #ffffff 48%, #f1f5f9 100%);
    }

    .page-loader__glow {
      position: absolute;
      width: min(30rem, 90vw);
      aspect-ratio: 1;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary-500) 8%, transparent);
      filter: blur(5rem);
      animation: loader-breathe 2.4s ease-in-out infinite;
    }

    .page-loader__content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }

    .page-loader__mark {
      position: relative;
      display: grid;
      width: 7rem;
      aspect-ratio: 1;
      place-items: center;
    }

    .page-loader__orbit {
      position: absolute;
      border-radius: 50%;
      border-style: solid;
    }

    .page-loader__orbit--outer {
      inset: 0;
      border-width: 2px;
      border-color: color-mix(in srgb, var(--color-primary-500) 18%, transparent);
      border-top-color: var(--color-primary-500);
      animation: loader-spin 1.4s linear infinite;
    }

    .page-loader__orbit--inner {
      inset: 0.75rem;
      border-width: 1px;
      border-color: color-mix(in srgb, var(--color-primary-500) 14%, transparent);
      border-bottom-color: color-mix(in srgb, var(--color-primary-500) 70%, white);
      animation: loader-spin 2s linear infinite reverse;
    }

    .page-loader__logo {
      width: 3rem;
      height: 3rem;
      object-fit: contain;
      filter: drop-shadow(0 0.5rem 1rem color-mix(in srgb, var(--color-primary-500) 20%, transparent));
      animation: loader-float 1.8s ease-in-out infinite;
    }

    .page-loader__brand {
      margin: 1.5rem 0 0;
      color: #0f172a;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.04em;
    }

    .page-loader__brand span {
      color: var(--color-primary-500);
    }

    .page-loader__message {
      margin: 0.4rem 0 0;
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .page-loader__dots {
      display: flex;
      gap: 0.4rem;
      margin-top: 1.25rem;
    }

    .page-loader__dots span {
      width: 0.35rem;
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--color-primary-500);
      animation: loader-dot 1.2s ease-in-out infinite;
    }

    .page-loader__dots span:nth-child(2) {
      animation-delay: 150ms;
    }

    .page-loader__dots span:nth-child(3) {
      animation-delay: 300ms;
    }

    @keyframes loader-spin {
      to {
        transform: rotate(1turn);
      }
    }

    @keyframes loader-float {
      0%,
      100% {
        transform: translateY(0) scale(1);
      }

      50% {
        transform: translateY(-0.25rem) scale(1.04);
      }
    }

    @keyframes loader-breathe {
      0%,
      100% {
        opacity: 0.55;
        transform: scale(0.9);
      }

      50% {
        opacity: 1;
        transform: scale(1.05);
      }
    }

    @keyframes loader-dot {
      0%,
      60%,
      100% {
        opacity: 0.25;
        transform: translateY(0);
      }

      30% {
        opacity: 1;
        transform: translateY(-0.2rem);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .page-loader__glow,
      .page-loader__orbit,
      .page-loader__logo,
      .page-loader__dots span {
        animation: none;
      }

      .page-loader__orbit--outer {
        border-right-color: var(--color-primary-500);
      }
    }
  `
})
class PageLoader {}

@Component({
  selector: 'web-layout',
  imports: [RouterOutlet, Header, Footer, PageLoader],
  template: `
    @defer (on immediate) {
      <div class="min-h-screen overflow-x-hidden">
        <app-header />
        <main id="main-content">
          <router-outlet />
        </main>
        <app-footer />
      </div>
    } @placeholder {
      <web-page-loader />
    } @loading (minimum 500ms) {
      <web-page-loader />
    }
  `
})
export class WebLayout {}
