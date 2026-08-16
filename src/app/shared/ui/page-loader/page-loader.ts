import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative grid min-h-dvh place-items-center overflow-hidden bg-white"
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page">
      <div
        class="loader-glow absolute aspect-square w-[min(30rem,90vw)] rounded-full bg-primary-500/10 blur-[5rem]"
        aria-hidden="true"></div>

      <div class="relative flex flex-col items-center p-8 text-center">
        <div class="relative grid aspect-square w-28 place-items-center" aria-hidden="true">
          <span
            class="loader-orbit-outer absolute inset-0 rounded-full border-2 border-solid border-primary-500/20 border-t-primary-500"></span>
          <span
            class="loader-orbit-inner absolute inset-3 rounded-full border border-solid border-primary-500/15 border-b-primary-400"></span>
          <img src="/images/favicon.png" alt="" class="loader-logo size-12 object-contain drop-shadow-xl" />
        </div>

        <p class="mt-6 text-[2rem] font-bold tracking-[-0.04em] text-slate-900">
          fikiri<span class="text-primary-500">.</span>
        </p>
        <p class="mt-1.5 text-sm font-medium tracking-[0.08em] text-slate-500 uppercase">
          Chargement de votre expérience
        </p>

        <div class="mt-5 flex gap-1.5" aria-hidden="true">
          <span class="loader-dot size-1.5 rounded-full bg-primary-500"></span>
          <span class="loader-dot loader-dot--two size-1.5 rounded-full bg-primary-500"></span>
          <span class="loader-dot loader-dot--three size-1.5 rounded-full bg-primary-500"></span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .loader-glow {
      animation: loader-breathe 2.4s ease-in-out infinite;
    }

    .loader-orbit-outer {
      animation: loader-spin 1.4s linear infinite;
    }

    .loader-orbit-inner {
      animation: loader-spin 2s linear infinite reverse;
    }

    .loader-logo {
      animation: loader-float 1.8s ease-in-out infinite;
    }

    .loader-dot {
      animation: loader-dot 1.2s ease-in-out infinite;
    }

    .loader-dot--two {
      animation-delay: 150ms;
    }

    .loader-dot--three {
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
      .loader-glow,
      .loader-orbit-outer,
      .loader-orbit-inner,
      .loader-logo,
      .loader-dot {
        animation: none;
      }
    }
  `
})
export class PageLoader {}
