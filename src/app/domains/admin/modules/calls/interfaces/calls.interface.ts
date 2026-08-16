import { ICallSolution } from '@/app/core/interfaces';

export interface QueryParams {
  page: string | null;
  q: string | null;
}

export type CallRow = ICallSolution & { solutionsCount: number };
