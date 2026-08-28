import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '@/environments/environment';
import { Message } from '@/app/shared/ui/message/message';
import { SignInStore } from '../../data-access/sign-in.store';
import { ISignInPayload } from '../../interfaces/sign-in.interface';

@Component({
  templateUrl: './sign-in.html',
  providers: [SignInStore],
  imports: [Message, RouterLink, MatButtonModule, MatIconModule, MatInputModule, FormField, NgOptimizedImage]
})
export class AuthSignIn {
  protected store = inject(SignInStore);
  protected signInModel = signal<ISignInPayload>({ email: '', password: '' });
  protected signInForm = form(this.signInModel, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
  });
  protected hidePassword = true;

  protected onSignIn(): void {
    submit(this.signInForm, async (form) => {
      this.store.signIn(form().value());
    });
  }

  protected signinWithGoogle(): void {
    window.location.replace(environment.apiUrl + '/auth/sign-in');
  }
}
