import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ResetPasswordStore } from '../../data-access/reset-password.store';
import { IResetPasswordPayload } from '../../interfaces/reset-password.interface';

@Component({
  templateUrl: './reset-password.html',
  providers: [ResetPasswordStore],
  imports: [FormField, RouterLink, MatButtonModule, MatIconModule, MatInputModule]
})
export class AuthResetPassword {
  protected store = inject(ResetPasswordStore);
  private token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';

  protected resetPasswordModel = signal<Omit<IResetPasswordPayload, 'token'>>({
    password: '',
    password_confirm: ''
  });
  protected resetPasswordForm = form(this.resetPasswordModel, (schemaPath) => {
    required(schemaPath.password);
    required(schemaPath.password_confirm);
  });
  protected hidePassword = true;
  protected hidePasswordConfirmation = true;

  protected onResetPassword(): void {
    submit(this.resetPasswordForm, async (form) => {
      this.store.resetPassword({ token: this.token, ...form().value() });
    });
  }
}
