import { Routes } from '@angular/router';
import { AuthLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'sign-in',
        title: 'Sign In',
        loadComponent: () => import('./features/sign-in/sign-in').then((c) => c.AuthSignIn)
      },
      {
        path: 'sign-up',
        title: 'Sign Up',
        loadComponent: () => import('./features/sign-up/sign-up').then((c) => c.AuthSignUp)
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () => import('./features/forgot-password/forgot-password').then((c) => c.AuthForgotPassword)
      },
      {
        path: 'reset-password',
        title: 'Reset Password',
        loadComponent: () => import('./features/reset-password/reset-password').then((c) => c.AuthResetPassword)
      }
    ]
  }
];

export default routes;
