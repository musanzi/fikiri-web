import { IUser } from '@/app/shared/interfaces';

export interface IAuthRequestState {
  isLoading: boolean;
  error: string;
}

export interface ISignUpState extends IAuthRequestState {
  user: IUser | null;
}
