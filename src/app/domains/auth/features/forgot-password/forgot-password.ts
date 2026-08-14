import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForgotPasswordStore } from '../../data-access/forgot-password.store';
import { IForgotPasswordPayload } from '../../interfaces/forgot-password.interface';

@Component({
  templateUrl: './forgot-password.html',
  providers: [ForgotPasswordStore],
  imports: [FormField, RouterLink, MatButtonModule, MatInputModule, MatProgressSpinnerModule]
})
export class AuthForgotPassword {
  protected store = inject(ForgotPasswordStore);
  protected forgotPasswordModel = signal<IForgotPasswordPayload>({ email: '' });
  protected forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
  });

  protected onForgotPassword(): void {
    submit(this.forgotPasswordForm, async (form) => {
      this.store.forgotPassword(form().value());
    });
  }
}
