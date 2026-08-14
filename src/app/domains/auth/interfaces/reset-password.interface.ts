export interface IResetPasswordPayload {
  token: string;
  password: string;
  password_confirm: string;
}
