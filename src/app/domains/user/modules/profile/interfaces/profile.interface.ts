import { IUser } from '@/app/shared/interfaces';

export interface IProfileFormModel {
  name: string;
  email: string;
}

export interface IUpdatePasswordFormModel {
  password: string;
  confirmPassword: string;
}

export interface IUpdatePasswordPayload {
  password: string;
}

export type IUpdateProfilePayload = Partial<IUser>;

export type IProfileResponse = IUser;

export interface IProfileImageResponse {
  data: IUser;
}

export interface IProfileState {
  isUpdatingProfile: boolean;
  isUpdatingProfileImage: boolean;
  isUpdatingPassword: boolean;
  profileUpdated: boolean;
  profileImageUpdated: boolean;
  passwordUpdated: boolean;
  profileError: string;
  profileImageError: string;
  passwordError: string;
}
