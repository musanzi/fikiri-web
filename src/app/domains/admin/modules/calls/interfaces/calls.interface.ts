import { ICallSolution, IForm } from '@/app/core/interfaces';

export interface QueryParams {
  page: string | null;
  q: string | null;
}

export type CallRow = ICallSolution & { solutionsCount: number };

export interface CallUsefulLink {
  label: string;
  url: string;
}

export interface CallContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  links: CallUsefulLink[];
}

export interface CallRequirement {
  title: string;
  description: string;
}

export interface CreateCallPayload {
  name: string;
  ended_at: string;
  started_at: string;
  description: string;
  form?: IForm[];
  review_form?: IForm[];
  contact_form?: CallContactInfo;
  requirements?: CallRequirement[];
}

export interface CreateCallFormModel {
  name: string;
  ended_at: Date;
  started_at: Date;
  description: string;
}

export interface CallDetails extends Omit<ICallSolution, 'contact_form' | 'form' | 'requirements'> {
  contact_form: CallContactInfo | null;
  form: IForm[] | null;
  requirements: CallRequirement[] | null;
}

export interface CallDetailsResponse {
  data: CallDetails;
}
