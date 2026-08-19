import { ICallSolution } from '@/app/core/interfaces';

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
