import { IUser, IRole } from '@/app/core/interfaces';

export interface IQueryParams {
  page: number;
  q: string;
}

export type UserRow = Omit<IUser, 'roles'> & { roles?: IRole[] };
