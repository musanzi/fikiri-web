import { Theming, Scheme } from '@/app/core/theming';
import { AuthStore } from '@/app/domains/auth/data-access';
import { environment } from '@/environments/environment';
import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'user',
  imports: [MatDivider, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './user.html'
})
export class User {
  authStore = inject(AuthStore);

  user = computed(() => this.authStore.user());

  avatarImageUrl = computed(() => {
    return this.user()?.profile
      ? `${environment.apiUrl}/uploads/profiles/${this.user()?.profile}`
      : '/images/avatar.webp';
  });

  private theming = inject(Theming);

  updateScheme(scheme: Scheme) {
    this.theming.scheme.set(scheme);
  }

  signOut(): void {
    this.authStore.signOut();
  }
}
