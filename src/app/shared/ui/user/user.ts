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

  signOut(): void {
    this.authStore.signOut();
  }
}
