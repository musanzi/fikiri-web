import { IOrganization } from '@/app/shared/interfaces';

export interface IOrganizationPayload {
  name: string;
}

export interface IOrganizationsResponse {
  data: IOrganization[];
}

export interface IOrganizationResponse {
  data: IOrganization;
}

export interface IUpdateOrganizationCommand {
  id: string;
  payload: IOrganizationPayload;
}

export interface IRemoveOrganizationCommand {
  id: string;
}

export interface IOrganizationDialogData {
  organization?: IOrganization;
}

export interface IOrganizationDialogResult {
  payload: IOrganizationPayload;
}

export interface IRemoveOrganizationDialogData {
  organization: IOrganization;
}

export interface IOrganizationsState {
  organizations: IOrganization[];
  isLoading: boolean;
  isSaving: boolean;
  removingOrganizationId: string;
  error: string;
}
