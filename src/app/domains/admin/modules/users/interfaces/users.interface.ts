import { IOrganization, IRole, IUser } from '@/app/core/interfaces';

export interface IQueryParams {
  page: number;
  q: string;
}

export interface IUserSocial {
  name: string;
  link: string;
}

export interface IUserPayload {
  email: string;
  name: string;
  phone_number: string;
  address: string;
  organisation: string;
  bio: string;
  socials: IUserSocial[];
  roles: string[];
}

export interface IUserRow extends Omit<IUser, 'roles' | 'socials'> {
  roles?: IRole[];
  socials: IUserSocial[];
}

export interface IUsersResponse {
  data: [IUserRow[], number];
}

export interface IUserResponse {
  data: IUserRow;
}

export interface IRolesLookupResponse {
  data: IRole[];
}

export interface IOrganizationsLookupResponse {
  data: IOrganization[];
}

export interface IUpdateUserCommand {
  id: string;
  payload: IUserPayload;
}

export interface IRemoveUserCommand {
  id: string;
}

export interface IUserDialogData {
  organizations: IOrganization[];
  roles: IRole[];
  user?: IUserRow;
}

export interface IUserDialogResult {
  payload: IUserPayload;
}

export interface IRemoveUserDialogData {
  user: IUserRow;
}

export interface IUsersState {
  users: IUserRow[];
  usersCount: number;
  roles: IRole[];
  organizations: IOrganization[];
  isLoading: boolean;
  isLoadingLookups: boolean;
  isSaving: boolean;
  isExporting: boolean;
  removingUserId: string;
  error: string;
}
