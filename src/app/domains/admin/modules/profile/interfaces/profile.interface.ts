import { IUser } from '@/app/shared/interfaces';

export interface IProfileFormModel {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
}

export interface IUpdatePasswordFormModel {
  password: string;
  confirmPassword: string;
}

export interface IUpdatePasswordPayload {
  password: string;
}

export interface IProfileResponse {
  data: IUser;
}

export interface IProfileState {
  isUpdatingProfile: boolean;
  isUpdatingPassword: boolean;
  profileUpdated: boolean;
  passwordUpdated: boolean;
  profileError: string;
  passwordError: string;
}
