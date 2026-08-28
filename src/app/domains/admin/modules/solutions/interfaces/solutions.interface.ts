import type { IReview, SolutionStatus } from '@/app/shared/interfaces';

export interface QueryParams {
  page?: string | null;
  q?: string | null;
  call?: string | null;
  limit?: string | null;
}

export interface IUpdateSolutionPayload {
  status: SolutionStatus;
}

export interface ISolutionAnswerView {
  label: string;
  value: string;
}

export interface ISolutionReviewView {
  review: IReview;
  answers: ISolutionAnswerView[];
}
