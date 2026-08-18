import { ICallSolution } from '@/app/core/interfaces';

export interface IQueryParams {
  page: string | null;
  q: string | null;
}

export type ICallRow = ICallSolution & { solutionsCount: number };

export type ICreateCallPayload = Omit<
  ICallSolution,
  'document' | 'cover' | 'author' | 'publisher' | 'partners' | 'awards' | 'solutions' | 'gallery'
>;

export interface ICreateCallFormModel {
  name: string;
  ended_at: Date;
  started_at: Date;
  description: string;
}
