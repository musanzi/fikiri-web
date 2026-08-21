import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Scheme, Theming } from '@/app/core/theming';
import { AuthStore } from '@/app/domains/auth/data-access/auth.store';
import { environment } from '@/environments/environment';

@Component({
  selector: 'user',
  imports: [MatDivider, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, RouterLink],
  template: `
    <button
      class="flex w-full cursor-pointer items-center gap-x-3 rounded-xl p-2 text-left hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
      [matMenuTriggerFor]="userMenu">
      <img class="size-9 rounded-lg object-cover grayscale" [src]="profileImageUrl()" alt="User avatar" />
      <div class="flex min-w-0 flex-auto flex-col select-none">
        <div class="truncate font-medium">
          {{ user()?.name }}
        </div>
        <div class="text-on-surface-variant truncate text-sm">
          {{ user()?.email }}
        </div>
      </div>
      <mat-icon class="size-4" svgIcon="ellipsis-vertical" />
    </button>

    <mat-menu class="min-w-60" xPosition="before" yPosition="above" #userMenu="matMenu">
      <button class="py-2 [&>span]:flex [&>span]:items-center" mat-menu-item>
        <img class="size-9 rounded-lg object-cover" [src]="profileImageUrl()" alt="User avatar" />
        <div class="ml-3 flex min-w-0 flex-auto flex-col select-none">
          <div class="truncate font-medium">
            {{ user()?.name }}
          </div>
          <div class="text-on-surface-variant truncate text-xs">{{ user()?.email }}</div>
        </div>
      </button>
      <mat-divider />
      <a mat-menu-item routerLink="/admin/profile">
        <mat-icon svgIcon="user-round" />
        Mon profil
      </a>
      <mat-divider />
      <button mat-menu-item (click)="authStore.signOut()">
        <mat-icon svgIcon="log-out" />
        Sign out
      </button>
    </mat-menu>
  `
})
export class User {
  authStore = inject(AuthStore);
  theming = inject(Theming);

  scheme = computed(() => this.theming.scheme());
  user = computed(() => this.authStore.user());

  profileImageUrl = computed(() => {
    return this.user()?.profile
      ? `${environment.apiUrl}/uploads/profiles/${this.user()?.profile}`
      : '/images/avatar.webp';
  });

  schemes: { label: string; value: Scheme }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ];

  updateScheme(scheme: Scheme) {
    this.theming.scheme.set(scheme);
  }
}
