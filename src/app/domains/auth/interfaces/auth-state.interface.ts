import { IUser } from '@/app/core/interfaces';

export interface IAuthRequestState {
  isLoading: boolean;
  error: string;
}

export interface ISignUpState extends IAuthRequestState {
  user: IUser | null;
}
