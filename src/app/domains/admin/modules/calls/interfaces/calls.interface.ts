import { ICallContactInfo, ICallRequirement, ICallSolution, IForm } from '@/app/shared/interfaces';

export interface IQueryParams {
  page: string | null;
  q: string | null;
}

export type ICallRow = ICallSolution & { solutionsCount: number };

export interface ICreateCallFormModel {
  name: string;
  ended_at: Date;
  started_at: Date;
  description: string;
}

export interface ICreateCallPayload {
  name: string;
  ended_at: Date;
  started_at: Date;
  description: string;
  review_form: IForm[];
  form: IForm[];
  contact_form: ICallContactInfo;
  requirements: ICallRequirement[];
}

export interface IUpdatedCallPayload {
  name: string;
  ended_at: Date;
  started_at: Date;
  description: string;
  review_form: IForm[];
  form: IForm[];
  contact_form: ICallContactInfo;
  requirements: ICallRequirement[];
}
