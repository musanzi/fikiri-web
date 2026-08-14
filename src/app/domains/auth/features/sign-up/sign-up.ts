import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@/environments/environment';
import { SignUpStore } from '../../data-access/sign-up.store';
import { ISignUpPayload } from '../../interfaces/sign-up.interface';

@Component({
  templateUrl: './sign-up.html',
  providers: [SignUpStore],
  imports: [FormField, MatButtonModule, MatInputModule, MatProgressSpinnerModule, RouterLink]
})
export class AuthSignUp {
  protected store = inject(SignUpStore);
  private route = inject(ActivatedRoute);
  private link = this.route.snapshot.queryParams?.['link'] || '';

  protected signUpModel = signal<ISignUpPayload>({
    email: '',
    address: '',
    phone_number: '',
    name: ''
  });
  protected signUpForm = form(this.signUpModel, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.address);
    minLength(schemaPath.address, 3);
    minLength(schemaPath.phone_number, 10);
    pattern(schemaPath.phone_number, /^\+?[1-9]\d{1,14}$/);
    required(schemaPath.name);
    minLength(schemaPath.name, 3);
  });

  protected onSignUp(): void {
    submit(this.signUpForm, async (form) => {
      this.store.signUp({ payload: form().value(), link: this.link });
    });
  }

  protected signinWithGoogle(): void {
    window.location.replace(environment.apiUrl + '/auth/sign-in');
  }
}
